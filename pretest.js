/**
 * This script is for generating test files with pdftk to be compared with the files generated by the node-pdftk wrapper.
 * If your executable is not standard, change that here.
 */
const executable = process.env.PDFTK_PATH || 'pdftk';

const { exec, } = require('child_process');

function pdftk(command) {
    return new Promise((resolve, reject) => {
        exec(`${executable} ${command}`, (err, stdout) => {
            if (err) return reject(err);
            return resolve(stdout);
        });
    });
}

function sequentialPromise(operations) {
    return operations.reduce((promise, fn) => promise.then(result => fn().then(Array.prototype.concat.bind(result))), Promise.resolve([]));
}

const commands = [
    'test/files/form.pdf fill_form test/files/form.fdf output test/files/filledform.temp.pdf',
    'test/files/form.pdf fill_form test/files/formwithnumber.fdf output test/files/filledformwithnumber.temp.pdf',
    'test/files/form.pdf fill_form test/files/form.fdf output test/files/filledformflat.temp.pdf flatten',
    'test/files/form.pdf fill_form test/files/form.blank.fdf output test/files/filledformempty.temp.pdf flatten',
    'test/files/form.pdf generate_fdf output test/files/form.temp.fdf',
    'test/files/form.pdf stamp test/files/logo.pdf output test/files/stamp.temp.pdf',
    'test/files/form.pdf multistamp test/files/logo.pdf output test/files/multistamp.temp.pdf',
    'A=test/files/document1.pdf B=test/files/document2.pdf cat A B output test/files/documentcatwithdate.temp.pdf keep_final_id', 'test/files/documentcatwithdate.temp.pdf update_info_utf8 test/files/documentcat.info output test/files/documentcat.temp.pdf',
    'test/files/form.pdf background test/files/logo.pdf output test/files/background.temp.pdf',
    'test/files/form.pdf multibackground test/files/logo.pdf output test/files/multibackground.temp.pdf',
    'test/files/form.pdf dump_data_fields output test/files/form.fields.temp.info',
    'test/files/form.pdf dump_data_fields_utf8 output test/files/form.fields.utf8.temp.info',
].map(i => pdftk.bind(this, i));


sequentialPromise(commands)
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
