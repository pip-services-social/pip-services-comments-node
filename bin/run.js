let CommentsProcess = require('../obj/src/container/CommentsProcess').CommentsProcess;

try {
    new CommentsProcess().run(process.argv);
} catch (ex) {
    console.error(ex);
}
