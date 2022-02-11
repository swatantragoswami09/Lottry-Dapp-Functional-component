import React, { useState, useEffect } from "react";
import web3 from "./web3";
import lottery from "./lottery";
import { TailSpin } from "react-loader-spinner";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const getManager = async () => {
    const manager = await lottery.methods.manager().call();
    setManager(manager);
  };
  const getPlayers = async () => {
    const players = await lottery.methods.getPlayers().call();
    setPlayers(players);
  };
  const getBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address);
    setBalance(balance);
  };

  useEffect(() => {
    getManager();
    getPlayers();
    getBalance();
  }, [balance]);

  const onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    // setMessage("Waiting on Transaction success......");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setLoader(!loader);
    setMessage("You have been entered!");
  };
  const onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    setLoader(!loader);
    setMessage("Waiting on Trasaction to success........");
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    setLoader(false);
    setMessage("A Winner has been Picked!");
  };
  const onEnter = () => {
    setLoader(!loader);
  };

  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This Contract is managed by {manager}
        <br /> There are currently {players.length} people enter competing to
        win {web3.utils.fromWei(balance, "ether")} ether!
      </p>

      <hr />
      <form onSubmit={onSubmit}>
        <h4> Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
        </div>
        <button onClick={onEnter}>Enter</button>
      </form>

      <hr />
      <h4>Ready to pick a Winner?</h4>
      <button onClick={onClick}> Pick a Winner!</button>
      <hr />
      {loader ? (
        <TailSpin color="#00BFFF" height={80} width={80} />
      ) : (
        <h1>{message}</h1>
      )}
    </div>
  );
}

export default App;
