import todosSaga from './todos'

export default function* rootSaga() {
    yield [
        todosSaga()
    ]
}
