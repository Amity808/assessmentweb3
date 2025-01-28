import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { ethers } from "ethers";
import assessmentAbi from "./abi/assessment.json";
import { toast } from "react-toastify";

function App() {
  const [count, setCount] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);

  const [amountWithdraw, setAmountWithdraw] = useState(0);
  const [isloading, setIsloading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [connectState, setConnectState] = useState(false)

  const contractAddress = "0xe238b320A22af4c4EAf607cf30843e6eB7de567C";

  async function requestAccount() {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
  }

  const handleDeposit = async (e) => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      if(provider) {
        setConnectState(true)
      }
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress,assessmentAbi, signer);

      try {
        const tx = await contract.deposit(depositAmount);
        const reciept = await tx.wait();
        toast.success("Deposited Successfully");
      } catch (error) {
        toast.error("Deposited Error, Unxepected error");
      }
    }

  };

  const handleWithdraw = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      if(provider) {
        setConnectState(true)
      }
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress,assessmentAbi, signer);

      try {
        const tx = await contract.withdraw(amountWithdraw);
        const reciept = await tx.wait();
        toast.success("Withdraw Successfully");
      } catch (error) {
        toast.error("Withdraw Error, Unxepected error");
      }
    }
  };

  const getBalance = async () => {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      if(provider) {
        setConnectState(true)
      }
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress,assessmentAbi, signer);

      try {
        const tx = await contract.getBalance();
        const formatedBalance = await ethers.formatEther(tx)
        setBalance(formatedBalance);
        toast.success("Deposited Successfully");
        // return reciept
      } catch (error) {
        toast.error("Deposited Error, Unxepected error");
      }
    }
  };

  return (
    <>
    <div className="flex justify-center flex-col m-10">

      <div className="">
        <div className=" mb-5">
    {connectState ? <p>Wallet Connected</p> : <p>Connect Wallet</p>}
        </div>
        <div className=" mb-5">
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="input deposit amount" className=" p-2 border-2 rounded-2xl mr-5"
          />
          <button className=" bg-black py-2 px-2 text-white rounded-md" onClick={handleDeposit}>Deposit</button>
        </div>

        <div className=" mb-5">
          <input
            type="text"
            value={amountWithdraw}
            onChange={(e) => setAmountWithdraw(e.target.value)}
            placeholder="withdraw amount" className=" p-2 border-2 rounded-2xl mr-5"
          />
          <button className=" bg-black py-2 px-2 text-white rounded-md" onClick={handleWithdraw}>Withdraw</button>
        </div>
      </div>
      <div>
        <h3>Current Balance: {balance}</h3>
        <button className=" bg-black py-2 px-2 text-white rounded-md" onClick={getBalance}>Get Balance</button>
      </div>
      </div>

    </>
  );
}

export default App;
