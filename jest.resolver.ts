const { join, relative } = require('path');

const testsRoot = '';
const snapshotsRoot = '.tests/snapshots';

module.exports = {
    resolveSnapshotPath: (path: string, ext: string) => join(process.cwd(), snapshotsRoot, relative(process.cwd(), path) + ext),
    resolveTestPath: (path: string, ext: string) => join(testsRoot, relative(snapshotsRoot, path).slice(0, -ext.length)),
    testPathForConsistencyCheck: 'src\\app\\app.service.spec.ts',
};