const getters = {
    language: state => state.app.language,
    size: state => state.app.size,
    errorLogs: state => state.errorLog.logs
}
export default getters