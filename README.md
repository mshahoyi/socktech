# Socktech

To run this project:

```bash
bun install && bun start
```

### An events journey

1. The event is ingested through an endpoint with its name and the email of the user.
2. The flows that get triggered by the event are filtered.
3. For matching flows, the actions that are the triggers children are added to a queue as jobs.
4. The workers dequeue the jobs and perform the actions accordingly. Once actions are successfully completed, those actions children, if they have any, are added to queue to repeat the process till all steps in a flow are completed.

### Data structures

#### Queue

A queue is needed to logically decouple scheduling from the work so that the application is fault tolerant (flows are completed even if the server crashes) and it can be easily turned into microservices and independently scaled in the future.

Our queue must support delayed jobs.

#### DAG

Flows can be represented with a directed acyclic graph (DAG). Each node in the graph represents a step in the flow. Each edge represents a transition between steps.

#### Flow

The DAG can be extended to implement the properties of a `Flow`, which consists of a single `trigger` and a number of `actions`. Flow execution will be in a breadth-first manner. When the trigger matches, the actions will be executed in order.

### Edge cases

1. What will happen to a flow execution if the the same event is sent twice by a user due to e.g. user misuse or an application bug? Will the flow be executed twice? or will the second event be ignored?
2. What if a queue job (e.g. sending the email) fails? How many times does the worker retry? Will the flow continue even if all retries are exhausted or pause at that step? I will go with infinite retries because implementing a fully fledged queue that handles all possible edge cases is out of the scope of this project. Exponential back-offs would be a plus to avoid overwhelming downstream services (e.g. the email API).

### TODOs

- [x] Setup project (linting, testing, formatting)
- [x] Setup endpoint to ingest events
- [x] Implement DAGs
- [x] Extend DAGs to implement flows
- [x] Implement flow db
- [x] Process events and trigger flows
- [x] Implement a Queue
- [x] Process queue jobs in a worker
- [ ] Update flow execution status in a db
- [ ] Implement a simple front page for our API showing us these information
  - [ ] Running flows
  - [ ] Completed flows
  - [ ] Failed flows
  - [ ] Trigger sample flow
- [ ] Retry mechanism for queue jobs with exponential back-offs
- [ ] Flows that only run once per event per user
- [ ] Throw error if adding edge to DAG would create a cycle
- [ ] Add a topological sort method to DAG
- [ ] Handle incorrect order of actions dependencies in the sample flow file
