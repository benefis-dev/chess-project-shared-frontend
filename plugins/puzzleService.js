import {PuzzleService} from "../services/PuzzleService"

export default ({$voyager, store}, inject) => {
    inject("puzzleService", new PuzzleService($voyager, store))
}
