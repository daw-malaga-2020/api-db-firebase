'use strict'

const expressApp = require('./app')

const port = process.env.PORT || 8082

const mongoose = require('mongoose');

(async () => {
  try {
const schema = new mongoose.Schema ({
  name: String,
  email: String,
}, { collection: 'users'});

const User = mongoose.model('User', schema);

await mongoose.connect('mongodb+srv://Jairo:l2QyhC0f4bPima3o@ddawmalaga2020-kfewq.mongodb.net/test?retryWrites=true&w=majority', {
  dbName: 'ddawmalaga',
  useNewUrlParser: true,

});

const user1 = new User ({
  name: 'leo',
  email: 'leo@leo.com'
});
await user1.save();

} catch (error) {
 console.error(error);
}
})();
expressApp.listen(port, () => console.info(`Server running in http://localhost:${port}`))
