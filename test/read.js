'use strict';

const IOBuffer = require('..');
const Buffer = require('buffer').Buffer;

describe('read data', function () {
    const data = new Uint32Array([0xff00ff00, 0x00ff00ff]);
    let buffer;
    beforeEach(function () {
        buffer = new IOBuffer(data);
    });

    it('construct', function () {
        // ArrayBuffer
        var buffer = new IOBuffer(new ArrayBuffer(4));
        buffer.length.should.equal(4);
        // Typed array
        buffer = new IOBuffer(new Uint8Array(2));
        buffer.length.should.equal(2);
        buffer = new IOBuffer(new Uint16Array(2));
        buffer.length.should.equal(4);
        // Node.js buffer
        buffer = new IOBuffer(new Buffer(5));
        buffer.length.should.equal(5);
    });

    it('readBoolean', function () {
        buffer.readBoolean().should.be.false();
        buffer.readBoolean().should.be.true();
        buffer.readBoolean().should.be.false();
        buffer.readBoolean().should.be.true();
    });

    it('readInt8', function () {
        buffer.readInt8().should.equal(0);
        buffer.readInt8().should.equal(-1);
        buffer.readInt8().should.equal(0);
        buffer.readInt8().should.equal(-1);
        buffer.readInt8().should.equal(-1);
        buffer.readInt8().should.equal(0);
        buffer.readInt8().should.equal(-1);
        buffer.readInt8().should.equal(0);
    });

    it('readUint8 / readByte / readBytes', function () {
        buffer.readUint8().should.equal(0);
        buffer.readUint8().should.equal(255);
        buffer.readByte().should.equal(0);
        buffer.readByte().should.equal(255);
        Array.from(buffer.readBytes()).should.eql([255]);
        Array.from(buffer.readBytes(3)).should.eql([0, 255, 0]);
    });

    it('readInt16', function () {
        buffer.readInt16().should.equal(-256);
        buffer.readInt16().should.equal(-256);
        buffer.readInt16().should.equal(255);
        buffer.readInt16().should.equal(255);
    });

    it('readUint16', function () {
        buffer.readUint16().should.equal(65280);
        buffer.readUint16().should.equal(65280);
        buffer.readUint16().should.equal(255);
        buffer.readUint16().should.equal(255);
    });

    it('readInt32', function () {
        buffer.readInt32().should.equal(-16711936);
        buffer.readInt32().should.equal(16711935);
    });

    it('readUint32', function () {
        buffer.readUint32().should.equal(4278255360);
        buffer.readUint32().should.equal(16711935);
    });

    it('readFloat32', function () {
        buffer.readFloat32().should.approximately(-1.71e38, 0.01e38);
        buffer.readFloat32().should.approximately(2.34e-38, 0.01e-38);
    });

    it('readFloat64', function () {
        buffer.readFloat64().should.approximately(7.06e-304, 0.01e-304);
    });

    it('readChar(s)', function () {
        var chars = 'hello'.split('').map(char => char.charCodeAt(0));
        var buffer = new IOBuffer(new Uint8Array(chars));
        buffer.readChar().should.equal('h');
        buffer.readChars().should.equal('e');
        buffer.readChars(3).should.equal('llo');
    });

    it('readUtf8', function () {
        var buffer = new IOBuffer(Buffer.from([42, 0x34, 0x32, 0xE2, 0x82, 0xAC, 42]));
        buffer.readByte().should.equal(42);
        var str = buffer.readUtf8(5);
        str.should.equal('42€');
        buffer.readByte().should.equal(42);
    });
});
