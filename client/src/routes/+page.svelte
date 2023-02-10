<script lang="ts">
  import { onMount } from 'svelte'

  let socket: WebSocket;
  let name: string;
  let score: number;
  let logs: string[] = [];
  let leaderboard = [
    // TODO: implement endpoint to get ranks and 
    {value: 'name1', score: 100},
    {value: 'name2', score: 90},
    {value: 'name3', score: 80},
    {value: 'name4', score: 70},
    {value: 'name5', score: 60},
    {value: 'name6', score: 50},
    {value: 'name7', score: 40},
    {value: 'name8', score: 30},
    {value: 'name9', score: 20},
    {value: 'name10', score: 10}
  ];

  const addLog = (log: string) => {
    logs = [...logs, log]
  }

  const connect = () => {
    socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", (event) => {
      // console.log("WebSocket connected");
      addLog("WebSocket connected")
    });

    function parseMessage(eventData: string){
      try {
        return JSON.parse(eventData)
      } catch {
        console.warn('Could not parse JSON')
        return eventData
      }
    }

    socket.addEventListener("message", (event) => {
      // console.log("Received message: ", event.data);
      addLog(`Received message: ${event.data}`)
      const parsedMessage = parseMessage(event.data)
      console.log({parsedMessage})

      if (parsedMessage.leaderboard) {
        leaderboard = parsedMessage.leaderboard;
      }
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket closed");
      addLog("WebSocket closed")
    });
  };

  // const sendMessage = (message: string) => {
  //   socket.send(message);
  // };

  async function submitScore() {
    try{
      const response = await fetch('http://localhost:3000/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, score })
      });

      if (response.ok) {
        console.log('Score submitted successfully');
        addLog('Score submitted successfully');
      } else {
        console.error('Failed to submit score');
        addLog('Failed to submit score')
      }
    } catch (err) {
      console.error(err)
    }
  }

  onMount(async () => {
    connect()
  })
  
  // $: connected = socket && socket.readyState === WebSocket.OPEN;
</script>

<style>
  .terminal-logs {
    border: 1px solid black;
    font-family: monospace;
    overflow-y: scroll;
    max-width: 600px;
    height: 200px;
  }

  table {
    border-collapse: collapse;
    width: 600px;
    font-family: monospace;
  }

  th,
  td {
    border: 1px solid black;
    text-align: left;
  }

  th {
    background-color: lightgray;
  }

</style>

<table>
  <thead>
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Score</th>
    </tr>
  </thead>
  <tbody>
    {#each leaderboard as position, i}
      <tr>
        <td>{i+1}</td>
        <td>{position.value}</td>
        <td>{position.score}</td>
      </tr>
    {/each}
  </tbody>
</table>

<label for="name-input">Name</label>
<input type="text" bind:value={name} />
<label for="score-input">Score</label>
<input id="score-input" type="number" bind:value={score} />
<button on:click={submitScore}>Submit Score</button>

<!-- <button on:click={() => sendMessage("Hello from Svelte!")} disabled={!connected}>
  Send Message
</button> -->

<div class="terminal-logs">
  <h3>Logs:</h3>
  <ul>
    {#each logs as log}
      <li>{log}</li>
    {/each}
  </ul>
</div>