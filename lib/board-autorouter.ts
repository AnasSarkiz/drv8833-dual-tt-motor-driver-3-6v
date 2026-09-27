import { EventEmitter } from "node:events"
import { AutoroutingPipelineSolver9_PreloadedTraceGraph } from "@tscircuit/capacity-autorouter"
import type {
  GenericLocalAutorouter,
  SimpleRouteJson,
  SimplifiedPcbTrace,
} from "tscircuit"

// Ask the solver for additional manufacturing margin; final native board DRC
// independently checks the resulting geometry against the board's rules.
class BoardAutorouter extends EventEmitter implements GenericLocalAutorouter {
  isRouting = false
  private solver: AutoroutingPipelineSolver9_PreloadedTraceGraph
  constructor(readonly input: SimpleRouteJson) {
    super()
    this.solver = new AutoroutingPipelineSolver9_PreloadedTraceGraph(
      {
        ...input,
        traces: input.traces?.map((trace) => {
          if (!trace.connection_name)
            throw new Error(
              `Existing trace ${trace.pcb_trace_id} has no connection name`,
            )
          return { ...trace, connection_name: trace.connection_name }
        }),
        defaultObstacleMargin: 0.25,
        minTraceToPadEdgeClearance: 0.25,
        minViaEdgeToPadEdgeClearance: 0.3,
      },
      { effort: 5 },
    )
  }
  solveSync(): SimplifiedPcbTrace[] {
    this.solver.solve()
    if (this.solver.failed)
      throw new Error(this.solver.error ?? "Board routing failed")
    return this.solver.getOutputSimplifiedPcbTraces()
  }
  start() {
    this.isRouting = true
    const step = () => {
      if (!this.isRouting) return
      try {
        for (
          let index = 0;
          index < 100 && !this.solver.solved && !this.solver.failed;
          index++
        )
          this.solver.step()
        if (this.solver.failed)
          throw new Error(this.solver.error ?? "Board routing failed")
        this.emit("progress", {
          type: "progress",
          steps: this.solver.iterations,
          progress: this.solver.computeProgress(),
          phase: this.solver.getCurrentPhase(),
        })
        if (this.solver.solved) {
          this.isRouting = false
          this.emit("complete", {
            type: "complete",
            traces: this.solver.getOutputSimplifiedPcbTraces(),
          })
        } else setTimeout(step, 0)
      } catch (error) {
        this.isRouting = false
        this.emit("error", {
          type: "error",
          error: error instanceof Error ? error : new Error(String(error)),
        })
      }
    }
    setTimeout(step, 0)
  }
  stop() {
    this.isRouting = false
  }
}
export async function createBoardAutorouter(input: SimpleRouteJson) {
  return new BoardAutorouter(input)
}
