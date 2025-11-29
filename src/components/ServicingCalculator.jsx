import React, { useEffect, useState } from 'react';
export default function ServicingCalculator(){
  const [lookups, setLookups] = useState({});
  const [loading, setLoading] = useState(true);
  const [loanAmount, setLoanAmount] = useState(300000);
  const [termYears, setTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(0.06);
  const [netMonthlyIncome, setNetMonthlyIncome] = useState(7000);
  const [existingRepayments, setExistingRepayments] = useState(500);
  const [livingExpenses, setLivingExpenses] = useState(1500);
  const [assessmentRatio, setAssessmentRatio] = useState(0.7);
  useEffect(()=>{
    async function loadAll(){
      const look = {};
      const data0 = await import('../src/data/Configuration.json');
      look['Configuration'] = data0.default;
      const data1 = await import('../src/data/Cache.json');
      look['Cache'] = data1.default;
      const data2 = await import('../src/data/Version_History.json');
      look['Version_History'] = data2.default;
      const data3 = await import('../src/data/Loan_Servicing_Calculator.json');
      look['Loan_Servicing_Calculator'] = data3.default;
      const data4 = await import('../src/data/Loan_Servicing_Calc_Cache.json');
      look['Loan_Servicing_Calc_Cache'] = data4.default;
      const data5 = await import('../src/data/SMSF_Servicing.json');
      look['SMSF_Servicing'] = data5.default;
      const data6 = await import('../src/data/Generate_Servicing_Calculator.json');
      look['Generate_Servicing_Calculator'] = data6.default;
      const data7 = await import('../src/data/Generate_Servicing_Calc_Cache.json');
      look['Generate_Servicing_Calc_Cache'] = data7.default;
      const data8 = await import('../src/data/Postcode_Lookup.json');
      look['Postcode_Lookup'] = data8.default;
      const data9 = await import('../src/data/Postcode_-_Private.json');
      look['Postcode_-_Private'] = data9.default;
      const data10 = await import('../src/data/Postcode_Lookup_Tables.json');
      look['Postcode_Lookup_Tables'] = data10.default;
      const data11 = await import('../src/data/Postcode_Lookup_Cache.json');
      look['Postcode_Lookup_Cache'] = data11.default;
      const data12 = await import('../src/data/FX_Conversion.json');
      look['FX_Conversion'] = data12.default;
      const data13 = await import('../src/data/FX_Conversion_Tables.json');
      look['FX_Conversion_Tables'] = data13.default;
      const data14 = await import('../src/data/BAS_Calculator.json');
      look['BAS_Calculator'] = data14.default;
      const data15 = await import('../src/data/Lease_Doc.json');
      look['Lease_Doc'] = data15.default;
      const data16 = await import('../src/data/Drop_In_Tables.json');
      look['Drop_In_Tables'] = data16.default;
      const data17 = await import('../src/data/Geographic_Classification.json');
      look['Geographic_Classification'] = data17.default;
      const data18 = await import('../src/data/Quantile_Regressions.json');
      look['Quantile_Regressions'] = data18.default;
      const data19 = await import('../src/data/Table_3.json');
      look['Table_3'] = data19.default;
      setLookups(look);
      setLoading(false);
    }
    loadAll();
  },[]);
  function monthlyPayment(principal, annualRate, years){
    principal = Number(principal)||0; annualRate = Number(annualRate)||0; years = Number(years)||0;
    if(!principal||!years) return 0; const r = annualRate/12; const n = years*12;
    if(r===0) return principal/n; return (principal * r) / (1 - Math.pow(1 + r, -n));
  }
  const newLoanPayment = monthlyPayment(loanAmount, interestRate, termYears);
  const totalRepayments = existingRepayments + newLoanPayment;
  const available = netMonthlyIncome - livingExpenses;
  const allowed = Math.max(0, available * assessmentRatio);
  const passes = totalRepayments <= allowed;
  const shortfall = Math.max(0, totalRepayments - allowed);
  if(loading) return <div className='container'><div className='card'>Loading lookup data from exported workbook (JSON)...</div></div>;
  return (
    <div className='container'>
      <h1 className='text-2xl font-bold mb-4'>Servicing Calculator — Full export</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='card'>
          <h3>Loan details</h3>
          <label>Loan amount</label>
          <input type='number' value={loanAmount} onChange={e=>setLoanAmount(e.target.value)} className='input' />
          <label>Term (years)</label>
          <input type='number' value={termYears} onChange={e=>setTermYears(e.target.value)} className='input' />
          <label>Interest rate (decimal)</label>
          <input type='number' step='0.0001' value={interestRate} onChange={e=>setInterestRate(e.target.value)} className='input' />
        </div>
        <div className='card'>
          <h3>Applicant</h3>
          <label>Net monthly income</label>
          <input type='number' value={netMonthlyIncome} onChange={e=>setNetMonthlyIncome(e.target.value)} className='input' />
          <label>Existing repayments</label>
          <input type='number' value={existingRepayments} onChange={e=>setExistingRepayments(e.target.value)} className='input' />
          <label>Living expenses</label>
          <input type='number' value={livingExpenses} onChange={e=>setLivingExpenses(e.target.value)} className='input' />
          <label>Assessment ratio</label>
          <input type='number' step='0.01' value={assessmentRatio} onChange={e=>setAssessmentRatio(e.target.value)} className='input' />
        </div>
      </div>
      <div className='card mt-4'>
        <h3>Results</h3>
        <div style={{display:'flex', gap:16}}>
          <div><div>New loan monthly payment</div><div style={{fontWeight:700}}>{`$${newLoanPayment.toFixed(2)}`}</div></div>
          <div><div>Total monthly repayments</div><div style={{fontWeight:700}}>{`$${totalRepayments.toFixed(2)}`}</div></div>
          <div><div>Allowed</div><div style={{fontWeight:700}}>{`$${allowed.toFixed(2)}`}</div></div>
        </div>
        <div style={{marginTop:12}}>
          <div className={`inline-block px-3 py-1 rounded-full ${passes ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{passes ? 'PASS' : 'FAIL'}</div>
          {!passes && <div style={{color:'#b91c1c', marginTop:8}}>Shortfall: {`$${shortfall.toFixed(2)}`}</div>}
        </div>
        <div style={{marginTop:12}}><h4>Loaded lookup sheets</h4><ul>
          <li key='BAS_Calculator' className='small'>BAS_Calculator — rows: {lookups['BAS_Calculator']?.length || 0}</li>
          <li key='Cache' className='small'>Cache — rows: {lookups['Cache']?.length || 0}</li>
          <li key='Configuration' className='small'>Configuration — rows: {lookups['Configuration']?.length || 0}</li>
          <li key='Drop_In_Tables' className='small'>Drop_In_Tables — rows: {lookups['Drop_In_Tables']?.length || 0}</li>
          <li key='FX_Conversion' className='small'>FX_Conversion — rows: {lookups['FX_Conversion']?.length || 0}</li>
          <li key='FX_Conversion_Tables' className='small'>FX_Conversion_Tables — rows: {lookups['FX_Conversion_Tables']?.length || 0}</li>
          <li key='Generate_Servicing_Calc_Cache' className='small'>Generate_Servicing_Calc_Cache — rows: {lookups['Generate_Servicing_Calc_Cache']?.length || 0}</li>
          <li key='Generate_Servicing_Calculator' className='small'>Generate_Servicing_Calculator — rows: {lookups['Generate_Servicing_Calculator']?.length || 0}</li>
          <li key='Geographic_Classification' className='small'>Geographic_Classification — rows: {lookups['Geographic_Classification']?.length || 0}</li>
          <li key='Lease_Doc' className='small'>Lease_Doc — rows: {lookups['Lease_Doc']?.length || 0}</li>
          <li key='Loan_Servicing_Calc_Cache' className='small'>Loan_Servicing_Calc_Cache — rows: {lookups['Loan_Servicing_Calc_Cache']?.length || 0}</li>
          <li key='Loan_Servicing_Calculator' className='small'>Loan_Servicing_Calculator — rows: {lookups['Loan_Servicing_Calculator']?.length || 0}</li>
          <li key='Postcode_-_Private' className='small'>Postcode_-_Private — rows: {lookups['Postcode_-_Private']?.length || 0}</li>
          <li key='Postcode_Lookup' className='small'>Postcode_Lookup — rows: {lookups['Postcode_Lookup']?.length || 0}</li>
          <li key='Postcode_Lookup_Cache' className='small'>Postcode_Lookup_Cache — rows: {lookups['Postcode_Lookup_Cache']?.length || 0}</li>
          <li key='Postcode_Lookup_Tables' className='small'>Postcode_Lookup_Tables — rows: {lookups['Postcode_Lookup_Tables']?.length || 0}</li>
          <li key='Quantile_Regressions' className='small'>Quantile_Regressions — rows: {lookups['Quantile_Regressions']?.length || 0}</li>
          <li key='SMSF_Servicing' className='small'>SMSF_Servicing — rows: {lookups['SMSF_Servicing']?.length || 0}</li>
          <li key='Table_3' className='small'>Table_3 — rows: {lookups['Table_3']?.length || 0}</li>
          <li key='Version_History' className='small'>Version_History — rows: {lookups['Version_History']?.length || 0}</li>
        </ul></div>
      </div>
    </div>
  );
}