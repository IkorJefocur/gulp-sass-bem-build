const
	stream   = require('stream'),
	nodeEval = require('node-eval'),
	build    = require('sass-bem');

class DeclToMixinStream extends stream.Transform {

	constructor(format = 'sass') {
		super({objectMode: true});
		this._format = format;
	}

	_transform(file, _, next) {
		let contents = '';
		for (const mixin of build(nodeEval(file.contents + '', file.path)))
			contents += `${mixin}\n`;
		file.contents = Buffer.from(contents);
		file.basename = `${file.basename.split('.')[0]}.${this._format}`;
		this.push(file);
		next();
	}

}

module.exports = format => new DeclToMixinStream(format);