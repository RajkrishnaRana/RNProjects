import moment from 'moment-timezone';
import { WorkerObj } from '../screens/PrintRecordsScreen';
import { PluckedQuantityObj } from '../screens/PrintRecordsScreen';

interface GenerateHTML {
    workers: WorkerObj[];
    pluckingData: PluckedQuantityObj;
    nonPluckingWorkers: PrintNonPluckingWorkers[];
    syncTime: string | null;
    currentVersion: string;
    operator: string;
    deviceName: string;
    recordindStatVal: string;
}

export const generateHTML = ({
    workers = [],
    pluckingData,
    nonPluckingWorkers = [],
    syncTime = null,
    currentVersion = '1.0',
    operator = 'Operator',
    deviceName = 'Unknown',
    recordindStatVal = '0.0',
}: GenerateHTML) => {
    const now = moment();
    const printDate = now.format('DD MMM YYYY');
    const printedOn = now.format('DD MMM YYYY HH:mm');
    const displaySyncTime = syncTime || 'n/a';

    console.log('workers', workers);

    let grandTotal = 0;
    let totalValidPluckingWorkers = 0;
    // let hasMultipleGroups = false;
    let html = `
    <html>
    <head>
      <title>TEAlink</title>
      <style>
        body { color: #000000; font-family: Arial, sans-serif; }
        p { margin: 4px 0; }
        table { width: 100%; border-top: 0.5px solid rgba(0,0,0,0.5); border-collapse: collapse; }
        table caption { text-align: left;
          font-weight: 800;
          text-decoration: underline;
          font-size: 10px;
          padding: 2px 0; }
        .bold { font-weight: bold; }
        .table1 tr td:first-child,
        .table1 thead tr th:first-child,
        .table1 thead tr th:last-child,
        .table1 tr td:last-child,
        .table1 thead tr th,
        .table1 tr td,
        .table2 thead tr th:first-child,
        .table2 thead tr th:last-child,
        .table2 tr td:first-child,
        .table2 tr td:last-child,
        .table2 tr td,
        .table2 thead tr th {
          border-left: 0.5px solid rgba(0,0,0,0.5);
          border-right: 0.5px solid rgba(0,0,0,0.5);
          border-bottom: 0.5px solid rgba(0,0,0,0.5);
        }
        td, th { font-size: 9px; padding: 3px; }
        th { font-size: 9px !important; padding: 3px !important; }
        .col10 { width: 10%; }
        .col8 { width: 8%; }
        .col7 { width: 7%; }
        .col20 { width: 20%; }
        .col3 { width: 3%; }
        .col2 { width: 2%; }
        .col5 { width: 5%; }
        .col15 { width: 15%; }
        .col25 { width: 25%; }
        .col40 { width: 40%; }
        .col43 { width: 43%; }
        div { float: left; clear: none; }
        .late { text-decoration: underline; }
        .right { text-align: right; padding-right: 10px; }
        .font11 { font-size: 11px; }
        .font12 { font-size: 12px; }
        .fontSmall { font-size: 7px !important; }
        .table1 th, .table2 th { text-align: center; }
        .table1 td, .table2 td { text-align: right; }
        .table1 td:nth-child(1),
        .table1 td:nth-child(2),
        .table1 td:nth-child(3),
        .table2 td:nth-child(2),
        .table2 td:nth-child(3),
        .table2 td:nth-child(4),
        .table2 td:nth-child(9),
        .table2 td:nth-child(12),
        .table2 td:nth-child(13) { text-align: left; }
      </style>
    </head>
    <body>
  `;

    // Header
    html += `
    <div>V - ${currentVersion}&nbsp; | &nbsp; <span class="bold">${printDate}</span>&nbsp;&nbsp; printed on - ${printedOn}&nbsp;&nbsp; 
    <span style="font-size: 11px;">(Last synced at - ${displaySyncTime})</span></div>
    <p>&nbsp;</p>
  `;

    // --- PLUCKING WORKERS (QC STYLE) ---
    if (workers.length > 0) {
        // Filter only valid plucking workers
        const validWorkers = workers.filter(worker => {
            if (!worker.worker_name) return false;
            const pData = pluckingData[worker.plucking_key] || {};
            const kg1 = Number(pData['1']?.qty) || 0;
            const kg2 = Number(pData['2']?.qty) || 0;
            const kg3 = Number(pData['3']?.qty) || 0;
            const kg4 = Number(pData['4']?.qty) || 0;
            return kg1 + kg2 + kg3 + kg4 > 0;
        });
        totalValidPluckingWorkers = validWorkers.length;

        if (validWorkers.length > 0) {
            const workersByKamjari = new Map<string, { kamjariName: string; workers: WorkerObj[] }>();
            validWorkers.forEach(worker => {
                const kamjariId = worker.kamjari_id || '__UNASSIGNED__';
                const kamjariName = worker.kamjari_name || 'N/A';
                const group = workersByKamjari.get(kamjariId);
                if (group) {
                    group.workers.push(worker);
                } else {
                    workersByKamjari.set(kamjariId, { kamjariName, workers: [worker] });
                }
            });

            workersByKamjari.forEach(({ kamjariName, workers: kamjariWorkers }) => {
                html += `
      <table class="table1" cellspacing="0" cellpadding="0">
        <caption>${kamjariName}</caption>
        <thead>
          <tr class="bold">
            <th>ID1</th>
            <th>ID2</th>
            <th>NAME</th>
            <th>TIME1</th>
            <th>KG1</th>
            <th>KG2</th>
            <th>TIME2</th>
            <th>KG3</th>
            <th>KG4</th>
            <th>TOT</th>
          </tr>
        </thead>
        <tbody>
    `;

                // let grandTotal = 0;
                // let w1gt = 0,
                let w2gt = 0;
                let kg1gt = 0,
                    kg2gt = 0,
                    kg3gt = 0,
                    kg4gt = 0;
                let kamjariTotal = 0;

                kamjariWorkers.forEach(worker => {
                    // Parse times
                    let time1 = '&nbsp;';
                    let time2 = '&nbsp;';

                    if (worker.IN_TIME && worker.IN_TIME.trim() !== '') {
                        try {
                            time1 = new Date(parseInt(worker.IN_TIME, 10)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            // w1gt++;
                        } catch {}
                    }

                    if (worker.OUT_TIME && worker.OUT_TIME !== worker.IN_TIME && worker.OUT_TIME.trim() !== '') {
                        try {
                            time2 = new Date(parseInt(worker.OUT_TIME, 10)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            w2gt++;
                        } catch {}
                    }

                    const pData = pluckingData[worker.plucking_key] || {};
                    const kg1 = Number(pData['1']?.qty) || 0;
                    const kg2 = Number(pData['2']?.qty) || 0;
                    const kg3 = Number(pData['3']?.qty) || 0;
                    const kg4 = Number(pData['4']?.qty) || 0;

                    kg1gt += kg1;
                    kg2gt += kg2;
                    kg3gt += kg3;
                    kg4gt += kg4;

                    const subTotal = kg1 + kg2 + kg3 + kg4;
                    kamjariTotal += subTotal;
                    grandTotal += subTotal;

                    const displayEmpNo =
                        worker.worker_emp_no === '999999' || worker.worker_emp_no === 999999 ? '--' : worker.worker_emp_no || '&nbsp;';

                    html += `
        <tr>
          <td>${worker.worker_book_name || 'J001'}/${displayEmpNo}</td>
          <td>${worker.worker_code || '&nbsp;'}</td>
          <td>${worker.worker_name || '&nbsp;'}</td>
          <td>${time1}</td>
          <td>${kg1 > 0 ? kg1 : '0.0'}</td>
          <td>${kg2 > 0 ? kg2 : '0.0'}</td>
          <td>${time2}</td>
          <td>${kg3 > 0 ? kg3 : '0.0'}</td>
          <td>${kg4 > 0 ? kg4 : '0.0'}</td>
          <td class="bold">${subTotal.toFixed(1)}</td>
        </tr>
      `;
                });

                // Grand Total Row
                html += `
        <tr>
          <td colspan="10" style="text-align:right;" class="bold">
            Total ${kamjariWorkers.length}No 
            ${kg1gt.toFixed(0)} 
            ${kg2gt.toFixed(1)} 
            ${w2gt}No 
            ${kg3gt.toFixed(1)} 
            ${kg4gt.toFixed(1)} 
            ${kamjariTotal.toFixed(1)}
          </td>
        </tr>
      </tbody>
      </table>
      <p>&nbsp;</p>
    `;
            });
        }
    }

    // --- NON-PLUCKING WORKERS ---
    if (nonPluckingWorkers.length > 0) {
        html += `
      <table class="table2" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="bold">
            <th class="col2"></th>
            <th class="col5">ID1</th>
            <th class="col5">ID2</th>
            <th class="col10">NAME</th>
            <th class="col5">TIME1</th>
            <th class="col5">TIME2</th>
            <th class="col5">TIME3</th>
            <th class="col5">TIME4</th>
            <th class="col10">BATCH</th>
            <th class="col10">MANDAY</th>
            <th class="col10">DOUBLY</th>
            <th class="col10">SEC</th>
            <th class="col15">DEPT</th>
          </tr>
        </thead>
        <tbody>
    `;

        let prevKey = '';
        let count = 1;

        nonPluckingWorkers.forEach((worker, idx) => {
            const currKey = worker?.batch_id || '';
            if (idx !== 0 && currKey !== prevKey) {
                html += `<tr><td colspan="13">&nbsp;</td></tr>`;
                count = 1;
            }

            const logs = worker?.auth_logs || [];
            const times = ['', '', '', ''];
            for (let i = 0; i < 4 && i < logs.length; i++) {
                try {
                    times[i] = new Date(Number(logs[i])).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                } catch (e) {}
            }

            const displayEmpNo = worker?.worker_emp_no === '999999' || worker?.worker_emp_no === 999999 ? '--' : worker?.worker_emp_no || '&nbsp;';

            html += `
        <tr>
          <td class="col2 bold">${count}</td>
          <td class="col5 fontSmall">${worker?.worker_book_name || ''}/${displayEmpNo}</td>
          <td class="col5 fontSmall">${worker?.worker_code || ''}</td>
          <td class="col10">${worker?.worker_name || ''}</td>
          <td class="col5">${times[0]}</td>
          <td class="col5">${times[1]}</td>
          <td class="col5">${times[2]}</td>
          <td class="col5">${times[3]}</td>
          <td class="col10">${worker?.batch_id || ''}</td>
          <td class="col10"></td>
          <td class="col10"></td>
          <td class="col10">${worker?.section_id || ''}</td>
          <td class="col15">${worker?.kamjari_id || ''}</td>
        </tr>
      `;

            // Handle more than 4 logs (optional — simplify for now)
            count++;
            prevKey = currKey;
        });

        html += `
        </tbody>
      </table>
    `;
    }

    // Summary stats
    if (totalValidPluckingWorkers > 0) {
        const avgKgPerWorker = grandTotal / totalValidPluckingWorkers;
        html += `
      <br>
      <table style="border:none">
        <tr>
          <td style="border:none; border-bottom: 1px solid;" class="col40">Plucking Type</td>
          <td style="border:none; border-bottom: 1px solid;" class="col40">Task</td>
          <td style="border:none; border-bottom: 1px solid;" class="col20">${avgKgPerWorker.toFixed(2)} Kg/pl</td>
        </tr>
      </table>

      <br>
      <table style="border:none">
        <tr>
          <td colspan="4" style="text-align:center;border-right:1px solid;border-left:1px solid;border-top:1px solid;">W1</td>
          <td colspan="4" style="text-align:center;border-right:1px solid;border-top:1px solid;">W2</td>
          <td colspan="4" style="text-align:center;border-right:1px solid;border-top:1px solid;">W3</td>
          <td colspan="4" style="text-align:center;border-right:1px solid;border-top:1px solid;">W4</td>
        </tr>
        <tr>
          ${Array(16).fill(`<td style="width:6%;border:1px solid;padding-top:20px;">&nbsp;</td>`).join('')}
        </tr>
      </table>
    `;
    }

    // Footer
    html += `
    <br><br>
    <table style="border:none">
      <tr>
        <td style="border:none; border-bottom: 1px solid;" class="col40">Operator</td>
        <td style="border:none; border-bottom: 1px solid;" class="col20">Date</td>
        <td style="border:none; border-bottom: 1px solid;" class="col40">Assistant</td>
      </tr>
    </table>
    <br>
    <div>
      ${operator} (on Device ${deviceName})
      ${workers.length > 0 ? `&nbsp; &nbsp; &nbsp; Avg. Plucking recording : ${recordindStatVal}` : ''}
    </div>
    </body>
    </html>
  `;

    return html;
};
