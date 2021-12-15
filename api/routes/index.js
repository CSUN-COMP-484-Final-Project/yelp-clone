const { send } = require('micro');

exports.GET = async (_req, res) => send(res, 200);
