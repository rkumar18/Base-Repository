


exports.sendSuccess = (res, message, code, data) => {
    const responseObject = {
        code: code || 200,
        message: message || 'success',
        data: data || {}
    }
    res.send(responseObject)
}

exports.sendError = (res, message, code, data) => {
    const responseObject = {
        code: code || 400,
        message: message || 'error',
        data: data || {}
    }
    res.send(responseObject)
}

exports.sendWrong = (res, message, code, data) => {
    const responseObject = {
        code: code || 500,
        message: message || 'something went wrong',
        data: data || {}
    }
    res.send(responseObject)
}