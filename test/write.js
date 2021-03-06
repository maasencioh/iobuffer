'use strict';

const IOBuffer = require('..');

describe('write data', function () {
    let buffer;
    beforeEach(function () {
        buffer = new IOBuffer(16);
    });

    it('writeBoolean', function () {
        buffer.writeBoolean();
        buffer.writeBoolean(true);
        buffer.writeBoolean(false);
        buffer.writeBoolean(1);
        buffer.writeBoolean('a');
        buffer.writeBoolean(0);
        buffer.writeBoolean({});
        buffer.writeBoolean('');
        check(buffer);
    });

    it('writeInt8', function () {
        buffer.writeInt8(0);
        buffer.writeInt8(-1);
        buffer.writeInt8(0);
        buffer.writeInt8(-1);
        buffer.writeInt8(-1);
        buffer.writeInt8(0);
        buffer.writeInt8(-1);
        buffer.writeInt8(0);
        check(buffer);
    });

    it('writeUint8 / writeByte / writeBytes', function () {
        buffer.writeUint8(0);
        buffer.writeUint8(255);
        buffer.writeByte(0);
        buffer.writeByte(255);
        buffer.writeBytes([255]);
        buffer.writeBytes([0, 255, 0]);
        check(buffer);
    });

    it('writeInt16', function () {
        buffer.writeInt16(-256);
        buffer.writeInt16(-256);
        buffer.writeInt16(255);
        buffer.writeInt16(255);
        check(buffer);
    });

    it('writeUint16', function () {
        buffer.writeUint16(65280);
        buffer.writeUint16(65280);
        buffer.writeUint16(255);
        buffer.writeUint16(255);
        check(buffer);
    });

    it('writeInt32', function () {
        buffer.writeInt32(-16711936);
        buffer.writeInt32(16711935);
        check(buffer);
    });

    it('writeUint32', function () {
        buffer.writeUint32(4278255360);
        buffer.writeUint32(16711935);
        check(buffer);
    });

    it('writeFloat32', function () {
        buffer.writeFloat32(-1.71e38);
        buffer.writeFloat32(2.34e-38);
        buffer.rewind();
        buffer.readFloat32().should.approximately(-1.71e38, 0.01e38);
        buffer.readFloat32().should.approximately(2.34e-38, 0.01e-38);
    });

    it('writeFloat64', function () {
        buffer.writeFloat64(7.06e-304);
        buffer.rewind();
        buffer.readFloat64().should.approximately(7.06e-304, 0.01e-304);
    });

    it('writeChar(s)', function () {
        const buffer = new IOBuffer(5);
        buffer.writeChar('h');
        buffer.writeChars('e');
        buffer.writeChars('llo');
        buffer.rewind();
        buffer.readChars(5).should.equal('hello');
    });

    it('write with too small AB', function () {
        const buffer = new IOBuffer(1);
        buffer.writeFloat64(1);
        buffer.byteLength.should.aboveOrEqual(4);
        buffer.length.should.equal(buffer.byteLength);
    });

    it('ensureAvailable', function () {
        const buffer = new IOBuffer(2);
        buffer.ensureAvailable();
        buffer.byteLength.should.equal(2);
        buffer.skip(2);
        buffer.ensureAvailable();
        buffer.byteLength.should.aboveOrEqual(3);
        buffer.seek(20);
        buffer.ensureAvailable(30);
        buffer.byteLength.should.aboveOrEqual(50);
    });

    it('writeUtf8', function () {
        const buffer = new IOBuffer();
        buffer.writeByte(42);
        buffer.writeUtf8('42€');
        buffer.writeByte(42);
        const uint8 = buffer.getBuffer();
        uint8.length.should.equal(7);
        uint8.should.eql(Buffer.from([42, 0x34, 0x32, 0xE2, 0x82, 0xAC, 42]));
    });
});

const good = new Uint8Array(new Uint32Array([0xff00ff00, 0x00ff00ff]).buffer);
function check(buffer) {
    buffer.length.should.equal(16);
    const ta = buffer.toArray();
    ta.should.eql(good);
}
