<script>
  let socket;
  let name;
  let score;
  let logs = [];

  const addLog = (log) => {
    logs = [...logs, log]
  }

  const connect = () => {
    socket = new WebSocket("ws://localhost:3000");

    socket.addEventListener("open", (event) => {
      // console.log("WebSocket connected");
      addLog("WebSocket connected")
    });

    socket.addEventListener("message", (event) => {
      // console.log("Received message: ", event.data);
      addLog(`Received message: ${event.data}`)
    });

    socket.addEventListener("close", (event) => {
      console.log("WebSocket closed");
      addLog("WebSocket closed")
    });
  };

  const sendMessage = (message) => {
    socket.send(message);
  };

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
  
  $: connected = socket && socket.readyState === WebSocket.OPEN;
</script>

<style>
  .terminal-logs {
    /* padding: 20px; */
    border: 1px solid black;
    /* background-color: black; */
    /* color: white; */
    font-family: monospace;
    overflow-y: scroll;
    max-width: 600px;
    height: 200px;
  }
</style>

<label for="name-input">Name</label>
<input type="text" bind:value={name} />
<br>
<label for="score-input">Score</label>
<input id="score-input" type="number" bind:value={score} />
<button on:click={submitScore}>Submit Score</button>

<button on:click={connect}>Connect</button>
<button on:click={() => sendMessage("Hello from Svelte!")} disabled={!connected}>
  Send Message
</button>

<div class="terminal-logs">
  <h3>Logs:</h3>
  <ul>
    {#each logs as log}
      <li>{log}</li>
    {/each}
  </ul>
</div>