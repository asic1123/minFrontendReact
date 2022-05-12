import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import getWETH from './callWethApprove.js'

const VaultAddress = "0xd972E1681Ad3937f5d405F3789a7ee47857Db939";

function App() {
  const [simpleStorage, setSimpleStorage] = useState(undefined);
  const [WETHContract, setWETHContract] = useState(undefined);
  const [data, setData] = useState(undefined);
  const [dataMim, setDataMim] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { simpleStorage } = await getBlockchain();
      const { WETHContract } = await getWETH();
      const data = await simpleStorage.readCollateral();
      const dataMim = await simpleStorage.readMim();
      // const data = 10;
      setSimpleStorage(simpleStorage);
      setWETHContract(WETHContract);
      setData(data);
      setDataMim(dataMim);
    };
    init();
  }, []);

  const updateData = async e => {
    e.preventDefault();
    const data = e.target.elements[0].value;
    const tz = await WETHContract.approve(VaultAddress, data);
    await tz.wait();
    const tx = await simpleStorage.addCollateral(data);
    await tx.wait();
    const newData = await simpleStorage.readCollateral();
    setData(newData);
  };

  const removeCollateral = async e => {
    e.preventDefault();
    const data = e.target.elements[0].value;
    const tx = await simpleStorage.removeCollateral(data);
    await tx.wait();
    const newData = await simpleStorage.readCollateral();
    setData(newData);
  };

  const borrowMim = async e => {
    e.preventDefault();
    const dataMim = e.target.elements[0].value;
    const tx = await simpleStorage.borrowMIM(dataMim);
    await tx.wait();
    const newDataMim = await simpleStorage.readMim();
    setDataMim(newDataMim);
  };

  const repayMim = async e => {
    e.preventDefault();
    const dataMim = e.target.elements[0].value;
    const tx = await simpleStorage.repayMIM(dataMim);
    await tx.wait();
    const newDataMim = await simpleStorage.readMim();
    setDataMim(newDataMim);
  };

  if(
    typeof simpleStorage === 'undefined'
    || typeof data === 'undefined'
    || typeof dataMim === 'undefined'
  ) {
    return 'Loading...';
  }

  return (
    <div className='container'>
      <br /> 
      <br /> 
      <br /> 
      <br /> 
      <div className='row'>
        <div className='col-sm-6'>
          <h2>Collateral Deposited:</h2>
          <p>{data.toString()}</p>
        </div>
        <div className='col-sm-6'>
          <h2>Add Collateral</h2>
          <form className="form-inline" onSubmit={e => updateData(e)}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="data"
            />
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <br /> 
      <br /> 
      <br /> 
      <br /> 
      <div className='row'>
        <div className='col-sm-6'>
          <h2>MIM Borrowed:</h2>
          <p>{dataMim.toString()}</p>
        </div>
        <div className='col-sm-6'>
          <h2>Borrow MIM</h2>
          <form className="form-inline" onSubmit={e => borrowMim(e)}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="data"
            />
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <br /> 
      <br /> 
      <br /> 
      <br /> 
      <div className='row'>
        <div className='col-sm-6'>
          <h2>MIM Borrowed:</h2>
          <p>{dataMim.toString()}</p>
        </div>
        <div className='col-sm-6'>
          <h2>Repay MIM</h2>
          <form className="form-inline" onSubmit={e => repayMim(e)}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="data"
            />
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div> 
      <br /> 
      <br /> 
      <br /> 
      <br /> 
      <div className='row'>
        <div className='col-sm-6'>
          <h2>Collateral Deposited:</h2>
          <p>{data.toString()}</p>
        </div>
        <div className='col-sm-6'>
          <h2>Remove Collateral</h2>
          <form className="form-inline" onSubmit={e => removeCollateral(e)}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="data"
            />
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;