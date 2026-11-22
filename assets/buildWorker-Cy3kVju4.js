function _mergeNamespaces(n, m) {
  m.forEach(function(e) {
    e && typeof e !== "string" && !Array.isArray(e) && Object.keys(e).forEach(function(k) {
      if (k !== "default" && !(k in n)) {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function() {
            return e[k];
          }
        });
      }
    });
  });
  return Object.freeze(n);
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function commonjsRequire(path) {
  throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var jszip_min = { exports: {} };
var hasRequiredJszip_min;
function requireJszip_min() {
  if (hasRequiredJszip_min) return jszip_min.exports;
  hasRequiredJszip_min = 1;
  (function(module, exports) {
    !(function(e) {
      module.exports = e();
    })(function() {
      return (function s(a, o, h) {
        function u(r, e2) {
          if (!o[r]) {
            if (!a[r]) {
              var t = "function" == typeof commonjsRequire && commonjsRequire;
              if (!e2 && t) return t(r, true);
              if (l) return l(r, true);
              var n = new Error("Cannot find module '" + r + "'");
              throw n.code = "MODULE_NOT_FOUND", n;
            }
            var i = o[r] = { exports: {} };
            a[r][0].call(i.exports, function(e3) {
              var t2 = a[r][1][e3];
              return u(t2 || e3);
            }, i, i.exports, s, a, o, h);
          }
          return o[r].exports;
        }
        for (var l = "function" == typeof commonjsRequire && commonjsRequire, e = 0; e < h.length; e++) u(h[e]);
        return u;
      })({ 1: [function(e, t, r) {
        var d = e("./utils"), c = e("./support"), p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        r.encode = function(e2) {
          for (var t2, r2, n, i, s, a, o, h = [], u = 0, l = e2.length, f = l, c2 = "string" !== d.getTypeOf(e2); u < e2.length; ) f = l - u, n = c2 ? (t2 = e2[u++], r2 = u < l ? e2[u++] : 0, u < l ? e2[u++] : 0) : (t2 = e2.charCodeAt(u++), r2 = u < l ? e2.charCodeAt(u++) : 0, u < l ? e2.charCodeAt(u++) : 0), i = t2 >> 2, s = (3 & t2) << 4 | r2 >> 4, a = 1 < f ? (15 & r2) << 2 | n >> 6 : 64, o = 2 < f ? 63 & n : 64, h.push(p.charAt(i) + p.charAt(s) + p.charAt(a) + p.charAt(o));
          return h.join("");
        }, r.decode = function(e2) {
          var t2, r2, n, i, s, a, o = 0, h = 0, u = "data:";
          if (e2.substr(0, u.length) === u) throw new Error("Invalid base64 input, it looks like a data url.");
          var l, f = 3 * (e2 = e2.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
          if (e2.charAt(e2.length - 1) === p.charAt(64) && f--, e2.charAt(e2.length - 2) === p.charAt(64) && f--, f % 1 != 0) throw new Error("Invalid base64 input, bad content length.");
          for (l = c.uint8array ? new Uint8Array(0 | f) : new Array(0 | f); o < e2.length; ) t2 = p.indexOf(e2.charAt(o++)) << 2 | (i = p.indexOf(e2.charAt(o++))) >> 4, r2 = (15 & i) << 4 | (s = p.indexOf(e2.charAt(o++))) >> 2, n = (3 & s) << 6 | (a = p.indexOf(e2.charAt(o++))), l[h++] = t2, 64 !== s && (l[h++] = r2), 64 !== a && (l[h++] = n);
          return l;
        };
      }, { "./support": 30, "./utils": 32 }], 2: [function(e, t, r) {
        var n = e("./external"), i = e("./stream/DataWorker"), s = e("./stream/Crc32Probe"), a = e("./stream/DataLengthProbe");
        function o(e2, t2, r2, n2, i2) {
          this.compressedSize = e2, this.uncompressedSize = t2, this.crc32 = r2, this.compression = n2, this.compressedContent = i2;
        }
        o.prototype = { getContentWorker: function() {
          var e2 = new i(n.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new a("data_length")), t2 = this;
          return e2.on("end", function() {
            if (this.streamInfo.data_length !== t2.uncompressedSize) throw new Error("Bug : uncompressed data size mismatch");
          }), e2;
        }, getCompressedWorker: function() {
          return new i(n.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
        } }, o.createWorkerFrom = function(e2, t2, r2) {
          return e2.pipe(new s()).pipe(new a("uncompressedSize")).pipe(t2.compressWorker(r2)).pipe(new a("compressedSize")).withStreamInfo("compression", t2);
        }, t.exports = o;
      }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(e, t, r) {
        var n = e("./stream/GenericWorker");
        r.STORE = { magic: "\0\0", compressWorker: function() {
          return new n("STORE compression");
        }, uncompressWorker: function() {
          return new n("STORE decompression");
        } }, r.DEFLATE = e("./flate");
      }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(e, t, r) {
        var n = e("./utils");
        var o = (function() {
          for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
            e2 = r2;
            for (var n2 = 0; n2 < 8; n2++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
            t2[r2] = e2;
          }
          return t2;
        })();
        t.exports = function(e2, t2) {
          return void 0 !== e2 && e2.length ? "string" !== n.getTypeOf(e2) ? (function(e3, t3, r2, n2) {
            var i = o, s = n2 + r2;
            e3 ^= -1;
            for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3[a])];
            return -1 ^ e3;
          })(0 | t2, e2, e2.length, 0) : (function(e3, t3, r2, n2) {
            var i = o, s = n2 + r2;
            e3 ^= -1;
            for (var a = n2; a < s; a++) e3 = e3 >>> 8 ^ i[255 & (e3 ^ t3.charCodeAt(a))];
            return -1 ^ e3;
          })(0 | t2, e2, e2.length, 0) : 0;
        };
      }, { "./utils": 32 }], 5: [function(e, t, r) {
        r.base64 = false, r.binary = false, r.dir = false, r.createFolders = true, r.date = null, r.compression = null, r.compressionOptions = null, r.comment = null, r.unixPermissions = null, r.dosPermissions = null;
      }, {}], 6: [function(e, t, r) {
        var n = null;
        n = "undefined" != typeof Promise ? Promise : e("lie"), t.exports = { Promise: n };
      }, { lie: 37 }], 7: [function(e, t, r) {
        var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array, i = e("pako"), s = e("./utils"), a = e("./stream/GenericWorker"), o = n ? "uint8array" : "array";
        function h(e2, t2) {
          a.call(this, "FlateWorker/" + e2), this._pako = null, this._pakoAction = e2, this._pakoOptions = t2, this.meta = {};
        }
        r.magic = "\b\0", s.inherits(h, a), h.prototype.processChunk = function(e2) {
          this.meta = e2.meta, null === this._pako && this._createPako(), this._pako.push(s.transformTo(o, e2.data), false);
        }, h.prototype.flush = function() {
          a.prototype.flush.call(this), null === this._pako && this._createPako(), this._pako.push([], true);
        }, h.prototype.cleanUp = function() {
          a.prototype.cleanUp.call(this), this._pako = null;
        }, h.prototype._createPako = function() {
          this._pako = new i[this._pakoAction]({ raw: true, level: this._pakoOptions.level || -1 });
          var t2 = this;
          this._pako.onData = function(e2) {
            t2.push({ data: e2, meta: t2.meta });
          };
        }, r.compressWorker = function(e2) {
          return new h("Deflate", e2);
        }, r.uncompressWorker = function() {
          return new h("Inflate", {});
        };
      }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(e, t, r) {
        function A(e2, t2) {
          var r2, n2 = "";
          for (r2 = 0; r2 < t2; r2++) n2 += String.fromCharCode(255 & e2), e2 >>>= 8;
          return n2;
        }
        function n(e2, t2, r2, n2, i2, s2) {
          var a, o, h = e2.file, u = e2.compression, l = s2 !== O.utf8encode, f = I.transformTo("string", s2(h.name)), c = I.transformTo("string", O.utf8encode(h.name)), d = h.comment, p = I.transformTo("string", s2(d)), m = I.transformTo("string", O.utf8encode(d)), _ = c.length !== h.name.length, g = m.length !== d.length, b = "", v = "", y = "", w = h.dir, k = h.date, x = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
          t2 && !r2 || (x.crc32 = e2.crc32, x.compressedSize = e2.compressedSize, x.uncompressedSize = e2.uncompressedSize);
          var S = 0;
          t2 && (S |= 8), l || !_ && !g || (S |= 2048);
          var z = 0, C = 0;
          w && (z |= 16), "UNIX" === i2 ? (C = 798, z |= (function(e3, t3) {
            var r3 = e3;
            return e3 || (r3 = t3 ? 16893 : 33204), (65535 & r3) << 16;
          })(h.unixPermissions, w)) : (C = 20, z |= (function(e3) {
            return 63 & (e3 || 0);
          })(h.dosPermissions)), a = k.getUTCHours(), a <<= 6, a |= k.getUTCMinutes(), a <<= 5, a |= k.getUTCSeconds() / 2, o = k.getUTCFullYear() - 1980, o <<= 4, o |= k.getUTCMonth() + 1, o <<= 5, o |= k.getUTCDate(), _ && (v = A(1, 1) + A(B2(f), 4) + c, b += "up" + A(v.length, 2) + v), g && (y = A(1, 1) + A(B2(p), 4) + m, b += "uc" + A(y.length, 2) + y);
          var E2 = "";
          return E2 += "\n\0", E2 += A(S, 2), E2 += u.magic, E2 += A(a, 2), E2 += A(o, 2), E2 += A(x.crc32, 4), E2 += A(x.compressedSize, 4), E2 += A(x.uncompressedSize, 4), E2 += A(f.length, 2), E2 += A(b.length, 2), { fileRecord: R.LOCAL_FILE_HEADER + E2 + f + b, dirRecord: R.CENTRAL_FILE_HEADER + A(C, 2) + E2 + A(p.length, 2) + "\0\0\0\0" + A(z, 4) + A(n2, 4) + f + b + p };
        }
        var I = e("../utils"), i = e("../stream/GenericWorker"), O = e("../utf8"), B2 = e("../crc32"), R = e("../signature");
        function s(e2, t2, r2, n2) {
          i.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = t2, this.zipPlatform = r2, this.encodeFileName = n2, this.streamFiles = e2, this.accumulate = false, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
        }
        I.inherits(s, i), s.prototype.push = function(e2) {
          var t2 = e2.meta.percent || 0, r2 = this.entriesCount, n2 = this._sources.length;
          this.accumulate ? this.contentBuffer.push(e2) : (this.bytesWritten += e2.data.length, i.prototype.push.call(this, { data: e2.data, meta: { currentFile: this.currentFile, percent: r2 ? (t2 + 100 * (r2 - n2 - 1)) / r2 : 100 } }));
        }, s.prototype.openedSource = function(e2) {
          this.currentSourceOffset = this.bytesWritten, this.currentFile = e2.file.name;
          var t2 = this.streamFiles && !e2.file.dir;
          if (t2) {
            var r2 = n(e2, t2, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
            this.push({ data: r2.fileRecord, meta: { percent: 0 } });
          } else this.accumulate = true;
        }, s.prototype.closedSource = function(e2) {
          this.accumulate = false;
          var t2 = this.streamFiles && !e2.file.dir, r2 = n(e2, t2, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          if (this.dirRecords.push(r2.dirRecord), t2) this.push({ data: (function(e3) {
            return R.DATA_DESCRIPTOR + A(e3.crc32, 4) + A(e3.compressedSize, 4) + A(e3.uncompressedSize, 4);
          })(e2), meta: { percent: 100 } });
          else for (this.push({ data: r2.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; ) this.push(this.contentBuffer.shift());
          this.currentFile = null;
        }, s.prototype.flush = function() {
          for (var e2 = this.bytesWritten, t2 = 0; t2 < this.dirRecords.length; t2++) this.push({ data: this.dirRecords[t2], meta: { percent: 100 } });
          var r2 = this.bytesWritten - e2, n2 = (function(e3, t3, r3, n3, i2) {
            var s2 = I.transformTo("string", i2(n3));
            return R.CENTRAL_DIRECTORY_END + "\0\0\0\0" + A(e3, 2) + A(e3, 2) + A(t3, 4) + A(r3, 4) + A(s2.length, 2) + s2;
          })(this.dirRecords.length, r2, e2, this.zipComment, this.encodeFileName);
          this.push({ data: n2, meta: { percent: 100 } });
        }, s.prototype.prepareNextSource = function() {
          this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
        }, s.prototype.registerPrevious = function(e2) {
          this._sources.push(e2);
          var t2 = this;
          return e2.on("data", function(e3) {
            t2.processChunk(e3);
          }), e2.on("end", function() {
            t2.closedSource(t2.previous.streamInfo), t2._sources.length ? t2.prepareNextSource() : t2.end();
          }), e2.on("error", function(e3) {
            t2.error(e3);
          }), this;
        }, s.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), true) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), true));
        }, s.prototype.error = function(e2) {
          var t2 = this._sources;
          if (!i.prototype.error.call(this, e2)) return false;
          for (var r2 = 0; r2 < t2.length; r2++) try {
            t2[r2].error(e2);
          } catch (e3) {
          }
          return true;
        }, s.prototype.lock = function() {
          i.prototype.lock.call(this);
          for (var e2 = this._sources, t2 = 0; t2 < e2.length; t2++) e2[t2].lock();
        }, t.exports = s;
      }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(e, t, r) {
        var u = e("../compressions"), n = e("./ZipFileWorker");
        r.generateWorker = function(e2, a, t2) {
          var o = new n(a.streamFiles, t2, a.platform, a.encodeFileName), h = 0;
          try {
            e2.forEach(function(e3, t3) {
              h++;
              var r2 = (function(e4, t4) {
                var r3 = e4 || t4, n3 = u[r3];
                if (!n3) throw new Error(r3 + " is not a valid compression method !");
                return n3;
              })(t3.options.compression, a.compression), n2 = t3.options.compressionOptions || a.compressionOptions || {}, i = t3.dir, s = t3.date;
              t3._compressWorker(r2, n2).withStreamInfo("file", { name: e3, dir: i, date: s, comment: t3.comment || "", unixPermissions: t3.unixPermissions, dosPermissions: t3.dosPermissions }).pipe(o);
            }), o.entriesCount = h;
          } catch (e3) {
            o.error(e3);
          }
          return o;
        };
      }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(e, t, r) {
        function n() {
          if (!(this instanceof n)) return new n();
          if (arguments.length) throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
          this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
            var e2 = new n();
            for (var t2 in this) "function" != typeof this[t2] && (e2[t2] = this[t2]);
            return e2;
          };
        }
        (n.prototype = e("./object")).loadAsync = e("./load"), n.support = e("./support"), n.defaults = e("./defaults"), n.version = "3.10.2", n.loadAsync = function(e2, t2) {
          return new n().loadAsync(e2, t2);
        }, n.external = e("./external"), t.exports = n;
      }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(e, t, r) {
        var u = e("./utils"), i = e("./external"), n = e("./utf8"), s = e("./zipEntries"), a = e("./stream/Crc32Probe"), l = e("./nodejsUtils");
        function f(n2) {
          return new i.Promise(function(e2, t2) {
            var r2 = n2.decompressed.getContentWorker().pipe(new a());
            r2.on("error", function(e3) {
              t2(e3);
            }).on("end", function() {
              r2.streamInfo.crc32 !== n2.decompressed.crc32 ? t2(new Error("Corrupted zip : CRC32 mismatch")) : e2();
            }).resume();
          });
        }
        t.exports = function(e2, o) {
          var h = this;
          return o = u.extend(o || {}, { base64: false, checkCRC32: false, optimizedBinaryString: false, createFolders: false, decodeFileName: n.utf8decode }), l.isNode && l.isStream(e2) ? i.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : u.prepareContent("the loaded zip file", e2, true, o.optimizedBinaryString, o.base64).then(function(e3) {
            var t2 = new s(o);
            return t2.load(e3), t2;
          }).then(function(e3) {
            var t2 = [i.Promise.resolve(e3)], r2 = e3.files;
            if (o.checkCRC32) for (var n2 = 0; n2 < r2.length; n2++) t2.push(f(r2[n2]));
            return i.Promise.all(t2);
          }).then(function(e3) {
            for (var t2 = e3.shift(), r2 = t2.files, n2 = 0; n2 < r2.length; n2++) {
              var i2 = r2[n2], s2 = i2.fileNameStr, a2 = u.resolve(i2.fileNameStr);
              h.file(a2, i2.decompressed, { binary: true, optimizedBinaryString: true, date: i2.date, dir: i2.dir, comment: i2.fileCommentStr.length ? i2.fileCommentStr : null, unixPermissions: i2.unixPermissions, dosPermissions: i2.dosPermissions, createFolders: o.createFolders }), i2.dir || (h.file(a2).unsafeOriginalName = s2);
            }
            return t2.zipComment.length && (h.comment = t2.zipComment), h;
          });
        };
      }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(e, t, r) {
        var n = e("../utils"), i = e("../stream/GenericWorker");
        function s(e2, t2) {
          i.call(this, "Nodejs stream input adapter for " + e2), this._upstreamEnded = false, this._bindStream(t2);
        }
        n.inherits(s, i), s.prototype._bindStream = function(e2) {
          var t2 = this;
          (this._stream = e2).pause(), e2.on("data", function(e3) {
            t2.push({ data: e3, meta: { percent: 0 } });
          }).on("error", function(e3) {
            t2.isPaused ? this.generatedError = e3 : t2.error(e3);
          }).on("end", function() {
            t2.isPaused ? t2._upstreamEnded = true : t2.end();
          });
        }, s.prototype.pause = function() {
          return !!i.prototype.pause.call(this) && (this._stream.pause(), true);
        }, s.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), true);
        }, t.exports = s;
      }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(e, t, r) {
        var i = e("readable-stream").Readable;
        function n(e2, t2, r2) {
          i.call(this, t2), this._helper = e2;
          var n2 = this;
          e2.on("data", function(e3, t3) {
            n2.push(e3) || n2._helper.pause(), r2 && r2(t3);
          }).on("error", function(e3) {
            n2.emit("error", e3);
          }).on("end", function() {
            n2.push(null);
          });
        }
        e("../utils").inherits(n, i), n.prototype._read = function() {
          this._helper.resume();
        }, t.exports = n;
      }, { "../utils": 32, "readable-stream": 16 }], 14: [function(e, t, r) {
        t.exports = { isNode: "undefined" != typeof Buffer, newBufferFrom: function(e2, t2) {
          if (Buffer.from && Buffer.from !== Uint8Array.from) return Buffer.from(e2, t2);
          if ("number" == typeof e2) throw new Error('The "data" argument must not be a number');
          return new Buffer(e2, t2);
        }, allocBuffer: function(e2) {
          if (Buffer.alloc) return Buffer.alloc(e2);
          var t2 = new Buffer(e2);
          return t2.fill(0), t2;
        }, isBuffer: function(e2) {
          return Buffer.isBuffer(e2);
        }, isStream: function(e2) {
          return e2 && "function" == typeof e2.on && "function" == typeof e2.pause && "function" == typeof e2.resume;
        } };
      }, {}], 15: [function(e, t, r) {
        function s(e2, t2, r2) {
          var n2, i2 = u.getTypeOf(t2), s2 = u.extend(r2 || {}, f);
          s2.date = s2.date || /* @__PURE__ */ new Date(), null !== s2.compression && (s2.compression = s2.compression.toUpperCase()), "string" == typeof s2.unixPermissions && (s2.unixPermissions = parseInt(s2.unixPermissions, 8)), s2.unixPermissions && 16384 & s2.unixPermissions && (s2.dir = true), s2.dosPermissions && 16 & s2.dosPermissions && (s2.dir = true), s2.dir && (e2 = g(e2)), s2.createFolders && (n2 = _(e2)) && b.call(this, n2, true);
          var a2 = "string" === i2 && false === s2.binary && false === s2.base64;
          r2 && void 0 !== r2.binary || (s2.binary = !a2), (t2 instanceof c && 0 === t2.uncompressedSize || s2.dir || !t2 || 0 === t2.length) && (s2.base64 = false, s2.binary = true, t2 = "", s2.compression = "STORE", i2 = "string");
          var o2 = null;
          o2 = t2 instanceof c || t2 instanceof l ? t2 : p.isNode && p.isStream(t2) ? new m(e2, t2) : u.prepareContent(e2, t2, s2.binary, s2.optimizedBinaryString, s2.base64);
          var h2 = new d(e2, o2, s2);
          this.files[e2] = h2;
        }
        var i = e("./utf8"), u = e("./utils"), l = e("./stream/GenericWorker"), a = e("./stream/StreamHelper"), f = e("./defaults"), c = e("./compressedObject"), d = e("./zipObject"), o = e("./generate"), p = e("./nodejsUtils"), m = e("./nodejs/NodejsStreamInputAdapter"), _ = function(e2) {
          "/" === e2.slice(-1) && (e2 = e2.substring(0, e2.length - 1));
          var t2 = e2.lastIndexOf("/");
          return 0 < t2 ? e2.substring(0, t2) : "";
        }, g = function(e2) {
          return "/" !== e2.slice(-1) && (e2 += "/"), e2;
        }, b = function(e2, t2) {
          return t2 = void 0 !== t2 ? t2 : f.createFolders, e2 = g(e2), this.files[e2] || s.call(this, e2, null, { dir: true, createFolders: t2 }), this.files[e2];
        };
        function h(e2) {
          return "[object RegExp]" === Object.prototype.toString.call(e2);
        }
        var n = { load: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, forEach: function(e2) {
          var t2, r2, n2;
          for (t2 in this.files) n2 = this.files[t2], (r2 = t2.slice(this.root.length, t2.length)) && t2.slice(0, this.root.length) === this.root && e2(r2, n2);
        }, filter: function(r2) {
          var n2 = [];
          return this.forEach(function(e2, t2) {
            r2(e2, t2) && n2.push(t2);
          }), n2;
        }, file: function(e2, t2, r2) {
          if (1 !== arguments.length) return e2 = this.root + e2, s.call(this, e2, t2, r2), this;
          if (h(e2)) {
            var n2 = e2;
            return this.filter(function(e3, t3) {
              return !t3.dir && n2.test(e3);
            });
          }
          var i2 = this.files[this.root + e2];
          return i2 && !i2.dir ? i2 : null;
        }, folder: function(r2) {
          if (!r2) return this;
          if (h(r2)) return this.filter(function(e3, t3) {
            return t3.dir && r2.test(e3);
          });
          var e2 = this.root + r2, t2 = b.call(this, e2), n2 = this.clone();
          return n2.root = t2.name, n2;
        }, remove: function(r2) {
          r2 = this.root + r2;
          var e2 = this.files[r2];
          if (e2 || ("/" !== r2.slice(-1) && (r2 += "/"), e2 = this.files[r2]), e2 && !e2.dir) delete this.files[r2];
          else for (var t2 = this.filter(function(e3, t3) {
            return t3.name.slice(0, r2.length) === r2;
          }), n2 = 0; n2 < t2.length; n2++) delete this.files[t2[n2].name];
          return this;
        }, generate: function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, generateInternalStream: function(e2) {
          var t2, r2 = {};
          try {
            if ((r2 = u.extend(e2 || {}, { streamFiles: false, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: i.utf8encode })).type = r2.type.toLowerCase(), r2.compression = r2.compression.toUpperCase(), "binarystring" === r2.type && (r2.type = "string"), !r2.type) throw new Error("No output type specified.");
            u.checkSupport(r2.type), "darwin" !== r2.platform && "freebsd" !== r2.platform && "linux" !== r2.platform && "sunos" !== r2.platform || (r2.platform = "UNIX"), "win32" === r2.platform && (r2.platform = "DOS");
            var n2 = r2.comment || this.comment || "";
            t2 = o.generateWorker(this, r2, n2);
          } catch (e3) {
            (t2 = new l("error")).error(e3);
          }
          return new a(t2, r2.type || "string", r2.mimeType);
        }, generateAsync: function(e2, t2) {
          return this.generateInternalStream(e2).accumulate(t2);
        }, generateNodeStream: function(e2, t2) {
          return (e2 = e2 || {}).type || (e2.type = "nodebuffer"), this.generateInternalStream(e2).toNodejsStream(t2);
        } };
        t.exports = n;
      }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(e, t, r) {
        t.exports = e("stream");
      }, { stream: void 0 }], 17: [function(e, t, r) {
        var n = e("./DataReader");
        function i(e2) {
          n.call(this, e2);
          for (var t2 = 0; t2 < this.data.length; t2++) e2[t2] = 255 & e2[t2];
        }
        e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
          return this.data[this.zero + e2];
        }, i.prototype.lastIndexOfSignature = function(e2) {
          for (var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.length - 4; 0 <= s; --s) if (this.data[s] === t2 && this.data[s + 1] === r2 && this.data[s + 2] === n2 && this.data[s + 3] === i2) return s - this.zero;
          return -1;
        }, i.prototype.readAndCheckSignature = function(e2) {
          var t2 = e2.charCodeAt(0), r2 = e2.charCodeAt(1), n2 = e2.charCodeAt(2), i2 = e2.charCodeAt(3), s = this.readData(4);
          return t2 === s[0] && r2 === s[1] && n2 === s[2] && i2 === s[3];
        }, i.prototype.readData = function(e2) {
          if (this.checkOffset(e2), 0 === e2) return [];
          var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 18: [function(e, t, r) {
        var n = e("../utils");
        function i(e2) {
          this.data = e2, this.length = e2.length, this.index = 0, this.zero = 0;
        }
        i.prototype = { checkOffset: function(e2) {
          this.checkIndex(this.index + e2);
        }, checkIndex: function(e2) {
          if (this.length < this.zero + e2 || e2 < 0) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + e2 + "). Corrupted zip ?");
        }, setIndex: function(e2) {
          this.checkIndex(e2), this.index = e2;
        }, skip: function(e2) {
          this.setIndex(this.index + e2);
        }, byteAt: function() {
        }, readInt: function(e2) {
          var t2, r2 = 0;
          for (this.checkOffset(e2), t2 = this.index + e2 - 1; t2 >= this.index; t2--) r2 = (r2 << 8) + this.byteAt(t2);
          return this.index += e2, r2;
        }, readString: function(e2) {
          return n.transformTo("string", this.readData(e2));
        }, readData: function() {
        }, lastIndexOfSignature: function() {
        }, readAndCheckSignature: function() {
        }, readDate: function() {
          var e2 = this.readInt(4);
          return new Date(Date.UTC(1980 + (e2 >> 25 & 127), (e2 >> 21 & 15) - 1, e2 >> 16 & 31, e2 >> 11 & 31, e2 >> 5 & 63, (31 & e2) << 1));
        } }, t.exports = i;
      }, { "../utils": 32 }], 19: [function(e, t, r) {
        var n = e("./Uint8ArrayReader");
        function i(e2) {
          n.call(this, e2);
        }
        e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
          this.checkOffset(e2);
          var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(e, t, r) {
        var n = e("./DataReader");
        function i(e2) {
          n.call(this, e2);
        }
        e("../utils").inherits(i, n), i.prototype.byteAt = function(e2) {
          return this.data.charCodeAt(this.zero + e2);
        }, i.prototype.lastIndexOfSignature = function(e2) {
          return this.data.lastIndexOf(e2) - this.zero;
        }, i.prototype.readAndCheckSignature = function(e2) {
          return e2 === this.readData(4);
        }, i.prototype.readData = function(e2) {
          this.checkOffset(e2);
          var t2 = this.data.slice(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./DataReader": 18 }], 21: [function(e, t, r) {
        var n = e("./ArrayReader");
        function i(e2) {
          n.call(this, e2);
        }
        e("../utils").inherits(i, n), i.prototype.readData = function(e2) {
          if (this.checkOffset(e2), 0 === e2) return new Uint8Array(0);
          var t2 = this.data.subarray(this.zero + this.index, this.zero + this.index + e2);
          return this.index += e2, t2;
        }, t.exports = i;
      }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(e, t, r) {
        var n = e("../utils"), i = e("../support"), s = e("./ArrayReader"), a = e("./StringReader"), o = e("./NodeBufferReader"), h = e("./Uint8ArrayReader");
        t.exports = function(e2) {
          var t2 = n.getTypeOf(e2);
          return n.checkSupport(t2), "string" !== t2 || i.uint8array ? "nodebuffer" === t2 ? new o(e2) : i.uint8array ? new h(n.transformTo("uint8array", e2)) : new s(n.transformTo("array", e2)) : new a(e2);
        };
      }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(e, t, r) {
        r.LOCAL_FILE_HEADER = "PK", r.CENTRAL_FILE_HEADER = "PK", r.CENTRAL_DIRECTORY_END = "PK", r.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", r.ZIP64_CENTRAL_DIRECTORY_END = "PK", r.DATA_DESCRIPTOR = "PK\x07\b";
      }, {}], 24: [function(e, t, r) {
        var n = e("./GenericWorker"), i = e("../utils");
        function s(e2) {
          n.call(this, "ConvertWorker to " + e2), this.destType = e2;
        }
        i.inherits(s, n), s.prototype.processChunk = function(e2) {
          this.push({ data: i.transformTo(this.destType, e2.data), meta: e2.meta });
        }, t.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(e, t, r) {
        var n = e("./GenericWorker"), i = e("../crc32");
        function s() {
          n.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
        }
        e("../utils").inherits(s, n), s.prototype.processChunk = function(e2) {
          this.streamInfo.crc32 = i(e2.data, this.streamInfo.crc32 || 0), this.push(e2);
        }, t.exports = s;
      }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(e, t, r) {
        var n = e("../utils"), i = e("./GenericWorker");
        function s(e2) {
          i.call(this, "DataLengthProbe for " + e2), this.propName = e2, this.withStreamInfo(e2, 0);
        }
        n.inherits(s, i), s.prototype.processChunk = function(e2) {
          if (e2) {
            var t2 = this.streamInfo[this.propName] || 0;
            this.streamInfo[this.propName] = t2 + e2.data.length;
          }
          i.prototype.processChunk.call(this, e2);
        }, t.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(e, t, r) {
        var n = e("../utils"), i = e("./GenericWorker");
        function s(e2) {
          i.call(this, "DataWorker");
          var t2 = this;
          this.dataIsReady = false, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = false, e2.then(function(e3) {
            t2.dataIsReady = true, t2.data = e3, t2.max = e3 && e3.length || 0, t2.type = n.getTypeOf(e3), t2.isPaused || t2._tickAndRepeat();
          }, function(e3) {
            t2.error(e3);
          });
        }
        n.inherits(s, i), s.prototype.cleanUp = function() {
          i.prototype.cleanUp.call(this), this.data = null;
        }, s.prototype.resume = function() {
          return !!i.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = true, n.delay(this._tickAndRepeat, [], this)), true);
        }, s.prototype._tickAndRepeat = function() {
          this._tickScheduled = false, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (n.delay(this._tickAndRepeat, [], this), this._tickScheduled = true));
        }, s.prototype._tick = function() {
          if (this.isPaused || this.isFinished) return false;
          var e2 = null, t2 = Math.min(this.max, this.index + 16384);
          if (this.index >= this.max) return this.end();
          switch (this.type) {
            case "string":
              e2 = this.data.substring(this.index, t2);
              break;
            case "uint8array":
              e2 = this.data.subarray(this.index, t2);
              break;
            case "array":
            case "nodebuffer":
              e2 = this.data.slice(this.index, t2);
          }
          return this.index = t2, this.push({ data: e2, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
        }, t.exports = s;
      }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(e, t, r) {
        function n(e2) {
          this.name = e2 || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = true, this.isFinished = false, this.isLocked = false, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
        }
        n.prototype = { push: function(e2) {
          this.emit("data", e2);
        }, end: function() {
          if (this.isFinished) return false;
          this.flush();
          try {
            this.emit("end"), this.cleanUp(), this.isFinished = true;
          } catch (e2) {
            this.emit("error", e2);
          }
          return true;
        }, error: function(e2) {
          return !this.isFinished && (this.isPaused ? this.generatedError = e2 : (this.isFinished = true, this.emit("error", e2), this.previous && this.previous.error(e2), this.cleanUp()), true);
        }, on: function(e2, t2) {
          return this._listeners[e2].push(t2), this;
        }, cleanUp: function() {
          this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
        }, emit: function(e2, t2) {
          if (this._listeners[e2]) for (var r2 = 0; r2 < this._listeners[e2].length; r2++) this._listeners[e2][r2].call(this, t2);
        }, pipe: function(e2) {
          return e2.registerPrevious(this);
        }, registerPrevious: function(e2) {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.streamInfo = e2.streamInfo, this.mergeStreamInfo(), this.previous = e2;
          var t2 = this;
          return e2.on("data", function(e3) {
            t2.processChunk(e3);
          }), e2.on("end", function() {
            t2.end();
          }), e2.on("error", function(e3) {
            t2.error(e3);
          }), this;
        }, pause: function() {
          return !this.isPaused && !this.isFinished && (this.isPaused = true, this.previous && this.previous.pause(), true);
        }, resume: function() {
          if (!this.isPaused || this.isFinished) return false;
          var e2 = this.isPaused = false;
          return this.generatedError && (this.error(this.generatedError), e2 = true), this.previous && this.previous.resume(), !e2;
        }, flush: function() {
        }, processChunk: function(e2) {
          this.push(e2);
        }, withStreamInfo: function(e2, t2) {
          return this.extraStreamInfo[e2] = t2, this.mergeStreamInfo(), this;
        }, mergeStreamInfo: function() {
          for (var e2 in this.extraStreamInfo) Object.prototype.hasOwnProperty.call(this.extraStreamInfo, e2) && (this.streamInfo[e2] = this.extraStreamInfo[e2]);
        }, lock: function() {
          if (this.isLocked) throw new Error("The stream '" + this + "' has already been used.");
          this.isLocked = true, this.previous && this.previous.lock();
        }, toString: function() {
          var e2 = "Worker " + this.name;
          return this.previous ? this.previous + " -> " + e2 : e2;
        } }, t.exports = n;
      }, {}], 29: [function(e, t, r) {
        var h = e("../utils"), i = e("./ConvertWorker"), s = e("./GenericWorker"), u = e("../base64"), n = e("../support"), a = e("../external"), o = null;
        if (n.nodestream) try {
          o = e("../nodejs/NodejsStreamOutputAdapter");
        } catch (e2) {
        }
        function l(e2, o2) {
          return new a.Promise(function(t2, r2) {
            var n2 = [], i2 = e2._internalType, s2 = e2._outputType, a2 = e2._mimeType;
            e2.on("data", function(e3, t3) {
              n2.push(e3), o2 && o2(t3);
            }).on("error", function(e3) {
              n2 = [], r2(e3);
            }).on("end", function() {
              try {
                var e3 = (function(e4, t3, r3) {
                  switch (e4) {
                    case "blob":
                      return h.newBlob(h.transformTo("arraybuffer", t3), r3);
                    case "base64":
                      return u.encode(t3);
                    default:
                      return h.transformTo(e4, t3);
                  }
                })(s2, (function(e4, t3) {
                  var r3, n3 = 0, i3 = null, s3 = 0;
                  for (r3 = 0; r3 < t3.length; r3++) s3 += t3[r3].length;
                  switch (e4) {
                    case "string":
                      return t3.join("");
                    case "array":
                      return Array.prototype.concat.apply([], t3);
                    case "uint8array":
                      for (i3 = new Uint8Array(s3), r3 = 0; r3 < t3.length; r3++) i3.set(t3[r3], n3), n3 += t3[r3].length;
                      return i3;
                    case "nodebuffer":
                      return Buffer.concat(t3);
                    default:
                      throw new Error("concat : unsupported type '" + e4 + "'");
                  }
                })(i2, n2), a2);
                t2(e3);
              } catch (e4) {
                r2(e4);
              }
              n2 = [];
            }).resume();
          });
        }
        function f(e2, t2, r2) {
          var n2 = t2;
          switch (t2) {
            case "blob":
            case "arraybuffer":
              n2 = "uint8array";
              break;
            case "base64":
              n2 = "string";
          }
          try {
            this._internalType = n2, this._outputType = t2, this._mimeType = r2, h.checkSupport(n2), this._worker = e2.pipe(new i(n2)), e2.lock();
          } catch (e3) {
            this._worker = new s("error"), this._worker.error(e3);
          }
        }
        f.prototype = { accumulate: function(e2) {
          return l(this, e2);
        }, on: function(e2, t2) {
          var r2 = this;
          return "data" === e2 ? this._worker.on(e2, function(e3) {
            t2.call(r2, e3.data, e3.meta);
          }) : this._worker.on(e2, function() {
            h.delay(t2, arguments, r2);
          }), this;
        }, resume: function() {
          return h.delay(this._worker.resume, [], this._worker), this;
        }, pause: function() {
          return this._worker.pause(), this;
        }, toNodejsStream: function(e2) {
          if (h.checkSupport("nodestream"), "nodebuffer" !== this._outputType) throw new Error(this._outputType + " is not supported by this method");
          return new o(this, { objectMode: "nodebuffer" !== this._outputType }, e2);
        } }, t.exports = f;
      }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(e, t, r) {
        if (r.base64 = true, r.array = true, r.string = true, r.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, r.nodebuffer = "undefined" != typeof Buffer, r.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) r.blob = false;
        else {
          var n = new ArrayBuffer(0);
          try {
            r.blob = 0 === new Blob([n], { type: "application/zip" }).size;
          } catch (e2) {
            try {
              var i = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              i.append(n), r.blob = 0 === i.getBlob("application/zip").size;
            } catch (e3) {
              r.blob = false;
            }
          }
        }
        try {
          r.nodestream = !!e("readable-stream").Readable;
        } catch (e2) {
          r.nodestream = false;
        }
      }, { "readable-stream": 16 }], 31: [function(e, t, s) {
        for (var o = e("./utils"), h = e("./support"), r = e("./nodejsUtils"), n = e("./stream/GenericWorker"), u = new Array(256), i = 0; i < 256; i++) u[i] = 252 <= i ? 6 : 248 <= i ? 5 : 240 <= i ? 4 : 224 <= i ? 3 : 192 <= i ? 2 : 1;
        u[254] = u[254] = 1;
        function a() {
          n.call(this, "utf-8 decode"), this.leftOver = null;
        }
        function l() {
          n.call(this, "utf-8 encode");
        }
        s.utf8encode = function(e2) {
          return h.nodebuffer ? r.newBufferFrom(e2, "utf-8") : (function(e3) {
            var t2, r2, n2, i2, s2, a2 = e3.length, o2 = 0;
            for (i2 = 0; i2 < a2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o2 += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
            for (t2 = h.uint8array ? new Uint8Array(o2) : new Array(o2), i2 = s2 = 0; s2 < o2; i2++) 55296 == (64512 & (r2 = e3.charCodeAt(i2))) && i2 + 1 < a2 && 56320 == (64512 & (n2 = e3.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
            return t2;
          })(e2);
        }, s.utf8decode = function(e2) {
          return h.nodebuffer ? o.transformTo("nodebuffer", e2).toString("utf-8") : (function(e3) {
            var t2, r2, n2, i2, s2 = e3.length, a2 = new Array(2 * s2);
            for (t2 = r2 = 0; t2 < s2; ) if ((n2 = e3[t2++]) < 128) a2[r2++] = n2;
            else if (4 < (i2 = u[n2])) a2[r2++] = 65533, t2 += i2 - 1;
            else {
              for (n2 &= 2 === i2 ? 31 : 3 === i2 ? 15 : 7; 1 < i2 && t2 < s2; ) n2 = n2 << 6 | 63 & e3[t2++], i2--;
              1 < i2 ? a2[r2++] = 65533 : n2 < 65536 ? a2[r2++] = n2 : (n2 -= 65536, a2[r2++] = 55296 | n2 >> 10 & 1023, a2[r2++] = 56320 | 1023 & n2);
            }
            return a2.length !== r2 && (a2.subarray ? a2 = a2.subarray(0, r2) : a2.length = r2), o.applyFromCharCode(a2);
          })(e2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2));
        }, o.inherits(a, n), a.prototype.processChunk = function(e2) {
          var t2 = o.transformTo(h.uint8array ? "uint8array" : "array", e2.data);
          if (this.leftOver && this.leftOver.length) {
            if (h.uint8array) {
              var r2 = t2;
              (t2 = new Uint8Array(r2.length + this.leftOver.length)).set(this.leftOver, 0), t2.set(r2, this.leftOver.length);
            } else t2 = this.leftOver.concat(t2);
            this.leftOver = null;
          }
          var n2 = (function(e3, t3) {
            var r3;
            for ((t3 = t3 || e3.length) > e3.length && (t3 = e3.length), r3 = t3 - 1; 0 <= r3 && 128 == (192 & e3[r3]); ) r3--;
            return r3 < 0 ? t3 : 0 === r3 ? t3 : r3 + u[e3[r3]] > t3 ? r3 : t3;
          })(t2), i2 = t2;
          n2 !== t2.length && (h.uint8array ? (i2 = t2.subarray(0, n2), this.leftOver = t2.subarray(n2, t2.length)) : (i2 = t2.slice(0, n2), this.leftOver = t2.slice(n2, t2.length))), this.push({ data: s.utf8decode(i2), meta: e2.meta });
        }, a.prototype.flush = function() {
          this.leftOver && this.leftOver.length && (this.push({ data: s.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
        }, s.Utf8DecodeWorker = a, o.inherits(l, n), l.prototype.processChunk = function(e2) {
          this.push({ data: s.utf8encode(e2.data), meta: e2.meta });
        }, s.Utf8EncodeWorker = l;
      }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(e, t, a) {
        var o = e("./support"), h = e("./base64"), r = e("./nodejsUtils"), u = e("./external");
        function n(e2) {
          return e2;
        }
        function l(e2, t2) {
          for (var r2 = 0; r2 < e2.length; ++r2) t2[r2] = 255 & e2.charCodeAt(r2);
          return t2;
        }
        e("setimmediate"), a.newBlob = function(t2, r2) {
          a.checkSupport("blob");
          try {
            return new Blob([t2], { type: r2 });
          } catch (e2) {
            try {
              var n2 = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
              return n2.append(t2), n2.getBlob(r2);
            } catch (e3) {
              throw new Error("Bug : can't construct the Blob.");
            }
          }
        };
        var i = { stringifyByChunk: function(e2, t2, r2) {
          var n2 = [], i2 = 0, s2 = e2.length;
          if (s2 <= r2) return String.fromCharCode.apply(null, e2);
          for (; i2 < s2; ) "array" === t2 || "nodebuffer" === t2 ? n2.push(String.fromCharCode.apply(null, e2.slice(i2, Math.min(i2 + r2, s2)))) : n2.push(String.fromCharCode.apply(null, e2.subarray(i2, Math.min(i2 + r2, s2)))), i2 += r2;
          return n2.join("");
        }, stringifyByChar: function(e2) {
          for (var t2 = "", r2 = 0; r2 < e2.length; r2++) t2 += String.fromCharCode(e2[r2]);
          return t2;
        }, applyCanBeUsed: { uint8array: (function() {
          try {
            return o.uint8array && 1 === String.fromCharCode.apply(null, new Uint8Array(1)).length;
          } catch (e2) {
            return false;
          }
        })(), nodebuffer: (function() {
          try {
            return o.nodebuffer && 1 === String.fromCharCode.apply(null, r.allocBuffer(1)).length;
          } catch (e2) {
            return false;
          }
        })() } };
        function s(e2) {
          var t2 = 65536, r2 = a.getTypeOf(e2), n2 = true;
          if ("uint8array" === r2 ? n2 = i.applyCanBeUsed.uint8array : "nodebuffer" === r2 && (n2 = i.applyCanBeUsed.nodebuffer), n2) for (; 1 < t2; ) try {
            return i.stringifyByChunk(e2, r2, t2);
          } catch (e3) {
            t2 = Math.floor(t2 / 2);
          }
          return i.stringifyByChar(e2);
        }
        function f(e2, t2) {
          for (var r2 = 0; r2 < e2.length; r2++) t2[r2] = e2[r2];
          return t2;
        }
        a.applyFromCharCode = s;
        var c = {};
        c.string = { string: n, array: function(e2) {
          return l(e2, new Array(e2.length));
        }, arraybuffer: function(e2) {
          return c.string.uint8array(e2).buffer;
        }, uint8array: function(e2) {
          return l(e2, new Uint8Array(e2.length));
        }, nodebuffer: function(e2) {
          return l(e2, r.allocBuffer(e2.length));
        } }, c.array = { string: s, array: n, arraybuffer: function(e2) {
          return new Uint8Array(e2).buffer;
        }, uint8array: function(e2) {
          return new Uint8Array(e2);
        }, nodebuffer: function(e2) {
          return r.newBufferFrom(e2);
        } }, c.arraybuffer = { string: function(e2) {
          return s(new Uint8Array(e2));
        }, array: function(e2) {
          return f(new Uint8Array(e2), new Array(e2.byteLength));
        }, arraybuffer: n, uint8array: function(e2) {
          return new Uint8Array(e2);
        }, nodebuffer: function(e2) {
          return r.newBufferFrom(new Uint8Array(e2));
        } }, c.uint8array = { string: s, array: function(e2) {
          return f(e2, new Array(e2.length));
        }, arraybuffer: function(e2) {
          return e2.buffer;
        }, uint8array: n, nodebuffer: function(e2) {
          return r.newBufferFrom(e2);
        } }, c.nodebuffer = { string: s, array: function(e2) {
          return f(e2, new Array(e2.length));
        }, arraybuffer: function(e2) {
          return c.nodebuffer.uint8array(e2).buffer;
        }, uint8array: function(e2) {
          return f(e2, new Uint8Array(e2.length));
        }, nodebuffer: n }, a.transformTo = function(e2, t2) {
          if (t2 = t2 || "", !e2) return t2;
          a.checkSupport(e2);
          var r2 = a.getTypeOf(t2);
          return c[r2][e2](t2);
        }, a.resolve = function(e2) {
          for (var t2 = e2.split("/"), r2 = [], n2 = 0; n2 < t2.length; n2++) {
            var i2 = t2[n2];
            "." === i2 || "" === i2 && 0 !== n2 && n2 !== t2.length - 1 || (".." === i2 ? r2.pop() : r2.push(i2));
          }
          return r2.join("/");
        }, a.getTypeOf = function(e2) {
          if ("string" == typeof e2) return "string";
          var t2 = Object.prototype.toString.call(e2);
          return "[object Array]" === t2 ? "array" : o.nodebuffer && r.isBuffer(e2) ? "nodebuffer" : o.uint8array && "[object Uint8Array]" === t2 ? "uint8array" : o.arraybuffer && "[object ArrayBuffer]" === t2 ? "arraybuffer" : void 0;
        }, a.checkSupport = function(e2) {
          if (!o[e2.toLowerCase()]) throw new Error(e2 + " is not supported by this platform");
        }, a.MAX_VALUE_16BITS = 65535, a.MAX_VALUE_32BITS = -1, a.pretty = function(e2) {
          var t2, r2, n2 = "";
          for (r2 = 0; r2 < (e2 || "").length; r2++) n2 += "\\x" + ((t2 = e2.charCodeAt(r2)) < 16 ? "0" : "") + t2.toString(16).toUpperCase();
          return n2;
        }, a.delay = function(e2, t2, r2) {
          setImmediate(function() {
            e2.apply(r2 || null, t2 || []);
          });
        }, a.inherits = function(e2, t2) {
          function r2() {
          }
          r2.prototype = t2.prototype, e2.prototype = new r2();
        }, a.extend = function() {
          var e2, t2, r2 = {};
          for (e2 = 0; e2 < arguments.length; e2++) for (t2 in arguments[e2]) Object.prototype.hasOwnProperty.call(arguments[e2], t2) && void 0 === r2[t2] && (r2[t2] = arguments[e2][t2]);
          return r2;
        }, a.prepareContent = function(r2, e2, n2, i2, s2) {
          return u.Promise.resolve(e2).then(function(n3) {
            return o.blob && (n3 instanceof Blob || -1 !== ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(n3))) ? void 0 !== Blob.prototype.arrayBuffer ? n3.arrayBuffer() : "undefined" != typeof FileReader ? new u.Promise(function(t2, r3) {
              var e3 = new FileReader();
              e3.onload = function(e4) {
                t2(e4.target.result);
              }, e3.onerror = function(e4) {
                r3(e4.target.error);
              }, e3.readAsArrayBuffer(n3);
            }) : u.Promise.reject(new Error(r2 + " is a Blob, but we have no way of reading it.")) : n3;
          }).then(function(e3) {
            var t2 = a.getTypeOf(e3);
            return t2 ? ("arraybuffer" === t2 ? e3 = a.transformTo("uint8array", e3) : "string" === t2 && (s2 ? e3 = h.decode(e3) : n2 && true !== i2 && (e3 = (function(e4) {
              return l(e4, o.uint8array ? new Uint8Array(e4.length) : new Array(e4.length));
            })(e3))), e3) : u.Promise.reject(new Error("Can't read the data of '" + r2 + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
          });
        };
      }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(e, t, r) {
        var n = e("./reader/readerFor"), i = e("./utils"), s = e("./signature"), a = e("./zipEntry"), o = e("./support");
        function h(e2) {
          this.files = [], this.loadOptions = e2;
        }
        h.prototype = { checkSignature: function(e2) {
          if (!this.reader.readAndCheckSignature(e2)) {
            this.reader.index -= 4;
            var t2 = this.reader.readString(4);
            throw new Error("Corrupted zip or bug: unexpected signature (" + i.pretty(t2) + ", expected " + i.pretty(e2) + ")");
          }
        }, isSignature: function(e2, t2) {
          var r2 = this.reader.index;
          this.reader.setIndex(e2);
          var n2 = this.reader.readString(4) === t2;
          return this.reader.setIndex(r2), n2;
        }, readBlockEndOfCentral: function() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
          var e2 = this.reader.readData(this.zipCommentLength), t2 = o.uint8array ? "uint8array" : "array", r2 = i.transformTo(t2, e2);
          this.zipComment = this.loadOptions.decodeFileName(r2);
        }, readBlockZip64EndOfCentral: function() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
          for (var e2, t2, r2, n2 = this.zip64EndOfCentralSize - 44; 0 < n2; ) e2 = this.reader.readInt(2), t2 = this.reader.readInt(4), r2 = this.reader.readData(t2), this.zip64ExtensibleData[e2] = { id: e2, length: t2, value: r2 };
        }, readBlockZip64EndOfCentralLocator: function() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function() {
          var e2, t2;
          for (e2 = 0; e2 < this.files.length; e2++) t2 = this.files[e2], this.reader.setIndex(t2.localHeaderOffset), this.checkSignature(s.LOCAL_FILE_HEADER), t2.readLocalPart(this.reader), t2.handleUTF8(), t2.processAttributes();
        }, readCentralDir: function() {
          var e2;
          for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(s.CENTRAL_FILE_HEADER); ) (e2 = new a({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(e2);
          if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function() {
          var e2 = this.reader.lastIndexOfSignature(s.CENTRAL_DIRECTORY_END);
          if (e2 < 0) throw !this.isSignature(0, s.LOCAL_FILE_HEADER) ? new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip: can't find end of central directory");
          this.reader.setIndex(e2);
          var t2 = e2;
          if (this.checkSignature(s.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = true, (e2 = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
            if (this.reader.setIndex(e2), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, s.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(s.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }
          var r2 = this.centralDirOffset + this.centralDirSize;
          this.zip64 && (r2 += 20, r2 += 12 + this.zip64EndOfCentralSize);
          var n2 = t2 - r2;
          if (0 < n2) this.isSignature(t2, s.CENTRAL_FILE_HEADER) || (this.reader.zero = n2);
          else if (n2 < 0) throw new Error("Corrupted zip: missing " + Math.abs(n2) + " bytes.");
        }, prepareReader: function(e2) {
          this.reader = n(e2);
        }, load: function(e2) {
          this.prepareReader(e2), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, t.exports = h;
      }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(e, t, r) {
        var n = e("./reader/readerFor"), s = e("./utils"), i = e("./compressedObject"), a = e("./crc32"), o = e("./utf8"), h = e("./compressions"), u = e("./support");
        function l(e2, t2) {
          this.options = e2, this.loadOptions = t2;
        }
        l.prototype = { isEncrypted: function() {
          return 1 == (1 & this.bitFlag);
        }, useUTF8: function() {
          return 2048 == (2048 & this.bitFlag);
        }, readLocalPart: function(e2) {
          var t2, r2;
          if (e2.skip(22), this.fileNameLength = e2.readInt(2), r2 = e2.readInt(2), this.fileName = e2.readData(this.fileNameLength), e2.skip(r2), -1 === this.compressedSize || -1 === this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
          if (null === (t2 = (function(e3) {
            for (var t3 in h) if (Object.prototype.hasOwnProperty.call(h, t3) && h[t3].magic === e3) return h[t3];
            return null;
          })(this.compressionMethod))) throw new Error("Corrupted zip : compression " + s.pretty(this.compressionMethod) + " unknown (inner file : " + s.transformTo("string", this.fileName) + ")");
          this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, t2, e2.readData(this.compressedSize));
        }, readCentralPart: function(e2) {
          this.versionMadeBy = e2.readInt(2), e2.skip(2), this.bitFlag = e2.readInt(2), this.compressionMethod = e2.readString(2), this.date = e2.readDate(), this.crc32 = e2.readInt(4), this.compressedSize = e2.readInt(4), this.uncompressedSize = e2.readInt(4);
          var t2 = e2.readInt(2);
          if (this.extraFieldsLength = e2.readInt(2), this.fileCommentLength = e2.readInt(2), this.diskNumberStart = e2.readInt(2), this.internalFileAttributes = e2.readInt(2), this.externalFileAttributes = e2.readInt(4), this.localHeaderOffset = e2.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");
          e2.skip(t2), this.readExtraFields(e2), this.parseZIP64ExtraField(e2), this.fileComment = e2.readData(this.fileCommentLength);
        }, processAttributes: function() {
          this.unixPermissions = null, this.dosPermissions = null;
          var e2 = this.versionMadeBy >> 8;
          this.dir = !!(16 & this.externalFileAttributes), 0 == e2 && (this.dosPermissions = 63 & this.externalFileAttributes), 3 == e2 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = true);
        }, parseZIP64ExtraField: function() {
          if (this.extraFields[1]) {
            var e2 = n(this.extraFields[1].value);
            this.uncompressedSize === s.MAX_VALUE_32BITS && (this.uncompressedSize = e2.readInt(8)), this.compressedSize === s.MAX_VALUE_32BITS && (this.compressedSize = e2.readInt(8)), this.localHeaderOffset === s.MAX_VALUE_32BITS && (this.localHeaderOffset = e2.readInt(8)), this.diskNumberStart === s.MAX_VALUE_32BITS && (this.diskNumberStart = e2.readInt(4));
          }
        }, readExtraFields: function(e2) {
          var t2, r2, n2, i2 = e2.index + this.extraFieldsLength;
          for (this.extraFields || (this.extraFields = {}); e2.index + 4 < i2; ) t2 = e2.readInt(2), r2 = e2.readInt(2), n2 = e2.readData(r2), this.extraFields[t2] = { id: t2, length: r2, value: n2 };
          e2.setIndex(i2);
        }, handleUTF8: function() {
          var e2 = u.uint8array ? "uint8array" : "array";
          if (this.useUTF8()) this.fileNameStr = o.utf8decode(this.fileName), this.fileCommentStr = o.utf8decode(this.fileComment);
          else {
            var t2 = this.findExtraFieldUnicodePath();
            if (null !== t2) this.fileNameStr = t2;
            else {
              var r2 = s.transformTo(e2, this.fileName);
              this.fileNameStr = this.loadOptions.decodeFileName(r2);
            }
            var n2 = this.findExtraFieldUnicodeComment();
            if (null !== n2) this.fileCommentStr = n2;
            else {
              var i2 = s.transformTo(e2, this.fileComment);
              this.fileCommentStr = this.loadOptions.decodeFileName(i2);
            }
          }
        }, findExtraFieldUnicodePath: function() {
          var e2 = this.extraFields[28789];
          if (e2) {
            var t2 = n(e2.value);
            return 1 !== t2.readInt(1) ? null : a(this.fileName) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
          }
          return null;
        }, findExtraFieldUnicodeComment: function() {
          var e2 = this.extraFields[25461];
          if (e2) {
            var t2 = n(e2.value);
            return 1 !== t2.readInt(1) ? null : a(this.fileComment) !== t2.readInt(4) ? null : o.utf8decode(t2.readData(e2.length - 5));
          }
          return null;
        } }, t.exports = l;
      }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(e, t, r) {
        function n(e2, t2, r2) {
          this.name = e2, this.dir = r2.dir, this.date = r2.date, this.comment = r2.comment, this.unixPermissions = r2.unixPermissions, this.dosPermissions = r2.dosPermissions, this._data = t2, this._dataBinary = r2.binary, this.options = { compression: r2.compression, compressionOptions: r2.compressionOptions };
        }
        var s = e("./stream/StreamHelper"), i = e("./stream/DataWorker"), a = e("./utf8"), o = e("./compressedObject"), h = e("./stream/GenericWorker");
        n.prototype = { internalStream: function(e2) {
          var t2 = null, r2 = "string";
          try {
            if (!e2) throw new Error("No output type specified.");
            var n2 = "string" === (r2 = e2.toLowerCase()) || "text" === r2;
            "binarystring" !== r2 && "text" !== r2 || (r2 = "string"), t2 = this._decompressWorker();
            var i2 = !this._dataBinary;
            i2 && !n2 && (t2 = t2.pipe(new a.Utf8EncodeWorker())), !i2 && n2 && (t2 = t2.pipe(new a.Utf8DecodeWorker()));
          } catch (e3) {
            (t2 = new h("error")).error(e3);
          }
          return new s(t2, r2, "");
        }, async: function(e2, t2) {
          return this.internalStream(e2).accumulate(t2);
        }, nodeStream: function(e2, t2) {
          return this.internalStream(e2 || "nodebuffer").toNodejsStream(t2);
        }, _compressWorker: function(e2, t2) {
          if (this._data instanceof o && this._data.compression.magic === e2.magic) return this._data.getCompressedWorker();
          var r2 = this._decompressWorker();
          return this._dataBinary || (r2 = r2.pipe(new a.Utf8EncodeWorker())), o.createWorkerFrom(r2, e2, t2);
        }, _decompressWorker: function() {
          return this._data instanceof o ? this._data.getContentWorker() : this._data instanceof h ? this._data : new i(this._data);
        } };
        for (var u = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], l = function() {
          throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
        }, f = 0; f < u.length; f++) n.prototype[u[f]] = l;
        t.exports = n;
      }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(e, l, t) {
        (function(t2) {
          var r, n, e2 = t2.MutationObserver || t2.WebKitMutationObserver;
          if (e2) {
            var i = 0, s = new e2(u), a = t2.document.createTextNode("");
            s.observe(a, { characterData: true }), r = function() {
              a.data = i = ++i % 2;
            };
          } else if (t2.setImmediate || void 0 === t2.MessageChannel) r = "document" in t2 && "onreadystatechange" in t2.document.createElement("script") ? function() {
            var e3 = t2.document.createElement("script");
            e3.onreadystatechange = function() {
              u(), e3.onreadystatechange = null, e3.parentNode.removeChild(e3), e3 = null;
            }, t2.document.documentElement.appendChild(e3);
          } : function() {
            setTimeout(u, 0);
          };
          else {
            var o = new t2.MessageChannel();
            o.port1.onmessage = u, r = function() {
              o.port2.postMessage(0);
            };
          }
          var h = [];
          function u() {
            var e3, t3;
            n = true;
            for (var r2 = h.length; r2; ) {
              for (t3 = h, h = [], e3 = -1; ++e3 < r2; ) t3[e3]();
              r2 = h.length;
            }
            n = false;
          }
          l.exports = function(e3) {
            1 !== h.push(e3) || n || r();
          };
        }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
      }, {}], 37: [function(e, t, r) {
        var i = e("immediate");
        function u() {
        }
        var l = {}, s = ["REJECTED"], a = ["FULFILLED"], n = ["PENDING"];
        function o(e2) {
          if ("function" != typeof e2) throw new TypeError("resolver must be a function");
          this.state = n, this.queue = [], this.outcome = void 0, e2 !== u && d(this, e2);
        }
        function h(e2, t2, r2) {
          this.promise = e2, "function" == typeof t2 && (this.onFulfilled = t2, this.callFulfilled = this.otherCallFulfilled), "function" == typeof r2 && (this.onRejected = r2, this.callRejected = this.otherCallRejected);
        }
        function f(t2, r2, n2) {
          i(function() {
            var e2;
            try {
              e2 = r2(n2);
            } catch (e3) {
              return l.reject(t2, e3);
            }
            e2 === t2 ? l.reject(t2, new TypeError("Cannot resolve promise with itself")) : l.resolve(t2, e2);
          });
        }
        function c(e2) {
          var t2 = e2 && e2.then;
          if (e2 && ("object" == typeof e2 || "function" == typeof e2) && "function" == typeof t2) return function() {
            t2.apply(e2, arguments);
          };
        }
        function d(t2, e2) {
          var r2 = false;
          function n2(e3) {
            r2 || (r2 = true, l.reject(t2, e3));
          }
          function i2(e3) {
            r2 || (r2 = true, l.resolve(t2, e3));
          }
          var s2 = p(function() {
            e2(i2, n2);
          });
          "error" === s2.status && n2(s2.value);
        }
        function p(e2, t2) {
          var r2 = {};
          try {
            r2.value = e2(t2), r2.status = "success";
          } catch (e3) {
            r2.status = "error", r2.value = e3;
          }
          return r2;
        }
        (t.exports = o).prototype.finally = function(t2) {
          if ("function" != typeof t2) return this;
          var r2 = this.constructor;
          return this.then(function(e2) {
            return r2.resolve(t2()).then(function() {
              return e2;
            });
          }, function(e2) {
            return r2.resolve(t2()).then(function() {
              throw e2;
            });
          });
        }, o.prototype.catch = function(e2) {
          return this.then(null, e2);
        }, o.prototype.then = function(e2, t2) {
          if ("function" != typeof e2 && this.state === a || "function" != typeof t2 && this.state === s) return this;
          var r2 = new this.constructor(u);
          this.state !== n ? f(r2, this.state === a ? e2 : t2, this.outcome) : this.queue.push(new h(r2, e2, t2));
          return r2;
        }, h.prototype.callFulfilled = function(e2) {
          l.resolve(this.promise, e2);
        }, h.prototype.otherCallFulfilled = function(e2) {
          f(this.promise, this.onFulfilled, e2);
        }, h.prototype.callRejected = function(e2) {
          l.reject(this.promise, e2);
        }, h.prototype.otherCallRejected = function(e2) {
          f(this.promise, this.onRejected, e2);
        }, l.resolve = function(e2, t2) {
          var r2 = p(c, t2);
          if ("error" === r2.status) return l.reject(e2, r2.value);
          var n2 = r2.value;
          if (n2) d(e2, n2);
          else {
            e2.state = a, e2.outcome = t2;
            for (var i2 = -1, s2 = e2.queue.length; ++i2 < s2; ) e2.queue[i2].callFulfilled(t2);
          }
          return e2;
        }, l.reject = function(e2, t2) {
          e2.state = s, e2.outcome = t2;
          for (var r2 = -1, n2 = e2.queue.length; ++r2 < n2; ) e2.queue[r2].callRejected(t2);
          return e2;
        }, o.resolve = function(e2) {
          if (e2 instanceof this) return e2;
          return l.resolve(new this(u), e2);
        }, o.reject = function(e2) {
          var t2 = new this(u);
          return l.reject(t2, e2);
        }, o.all = function(e2) {
          var r2 = this;
          if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
          var n2 = e2.length, i2 = false;
          if (!n2) return this.resolve([]);
          var s2 = new Array(n2), a2 = 0, t2 = -1, o2 = new this(u);
          for (; ++t2 < n2; ) h2(e2[t2], t2);
          return o2;
          function h2(e3, t3) {
            r2.resolve(e3).then(function(e4) {
              s2[t3] = e4, ++a2 !== n2 || i2 || (i2 = true, l.resolve(o2, s2));
            }, function(e4) {
              i2 || (i2 = true, l.reject(o2, e4));
            });
          }
        }, o.race = function(e2) {
          var t2 = this;
          if ("[object Array]" !== Object.prototype.toString.call(e2)) return this.reject(new TypeError("must be an array"));
          var r2 = e2.length, n2 = false;
          if (!r2) return this.resolve([]);
          var i2 = -1, s2 = new this(u);
          for (; ++i2 < r2; ) a2 = e2[i2], t2.resolve(a2).then(function(e3) {
            n2 || (n2 = true, l.resolve(s2, e3));
          }, function(e3) {
            n2 || (n2 = true, l.reject(s2, e3));
          });
          var a2;
          return s2;
        };
      }, { immediate: 36 }], 38: [function(e, t, r) {
        var n = {};
        (0, e("./lib/utils/common").assign)(n, e("./lib/deflate"), e("./lib/inflate"), e("./lib/zlib/constants")), t.exports = n;
      }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(e, t, r) {
        var a = e("./zlib/deflate"), o = e("./utils/common"), h = e("./utils/strings"), i = e("./zlib/messages"), s = e("./zlib/zstream"), u = Object.prototype.toString, l = 0, f = -1, c = 0, d = 8;
        function p(e2) {
          if (!(this instanceof p)) return new p(e2);
          this.options = o.assign({ level: f, method: d, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: c, to: "" }, e2 || {});
          var t2 = this.options;
          t2.raw && 0 < t2.windowBits ? t2.windowBits = -t2.windowBits : t2.gzip && 0 < t2.windowBits && t2.windowBits < 16 && (t2.windowBits += 16), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new s(), this.strm.avail_out = 0;
          var r2 = a.deflateInit2(this.strm, t2.level, t2.method, t2.windowBits, t2.memLevel, t2.strategy);
          if (r2 !== l) throw new Error(i[r2]);
          if (t2.header && a.deflateSetHeader(this.strm, t2.header), t2.dictionary) {
            var n2;
            if (n2 = "string" == typeof t2.dictionary ? h.string2buf(t2.dictionary) : "[object ArrayBuffer]" === u.call(t2.dictionary) ? new Uint8Array(t2.dictionary) : t2.dictionary, (r2 = a.deflateSetDictionary(this.strm, n2)) !== l) throw new Error(i[r2]);
            this._dict_set = true;
          }
        }
        function n(e2, t2) {
          var r2 = new p(t2);
          if (r2.push(e2, true), r2.err) throw r2.msg || i[r2.err];
          return r2.result;
        }
        p.prototype.push = function(e2, t2) {
          var r2, n2, i2 = this.strm, s2 = this.options.chunkSize;
          if (this.ended) return false;
          n2 = t2 === ~~t2 ? t2 : true === t2 ? 4 : 0, "string" == typeof e2 ? i2.input = h.string2buf(e2) : "[object ArrayBuffer]" === u.call(e2) ? i2.input = new Uint8Array(e2) : i2.input = e2, i2.next_in = 0, i2.avail_in = i2.input.length;
          do {
            if (0 === i2.avail_out && (i2.output = new o.Buf8(s2), i2.next_out = 0, i2.avail_out = s2), 1 !== (r2 = a.deflate(i2, n2)) && r2 !== l) return this.onEnd(r2), !(this.ended = true);
            0 !== i2.avail_out && (0 !== i2.avail_in || 4 !== n2 && 2 !== n2) || ("string" === this.options.to ? this.onData(h.buf2binstring(o.shrinkBuf(i2.output, i2.next_out))) : this.onData(o.shrinkBuf(i2.output, i2.next_out)));
          } while ((0 < i2.avail_in || 0 === i2.avail_out) && 1 !== r2);
          return 4 === n2 ? (r2 = a.deflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === l) : 2 !== n2 || (this.onEnd(l), !(i2.avail_out = 0));
        }, p.prototype.onData = function(e2) {
          this.chunks.push(e2);
        }, p.prototype.onEnd = function(e2) {
          e2 === l && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = o.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
        }, r.Deflate = p, r.deflate = n, r.deflateRaw = function(e2, t2) {
          return (t2 = t2 || {}).raw = true, n(e2, t2);
        }, r.gzip = function(e2, t2) {
          return (t2 = t2 || {}).gzip = true, n(e2, t2);
        };
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(e, t, r) {
        var c = e("./zlib/inflate"), d = e("./utils/common"), p = e("./utils/strings"), m = e("./zlib/constants"), n = e("./zlib/messages"), i = e("./zlib/zstream"), s = e("./zlib/gzheader"), _ = Object.prototype.toString;
        function a(e2) {
          if (!(this instanceof a)) return new a(e2);
          this.options = d.assign({ chunkSize: 16384, windowBits: 0, to: "" }, e2 || {});
          var t2 = this.options;
          t2.raw && 0 <= t2.windowBits && t2.windowBits < 16 && (t2.windowBits = -t2.windowBits, 0 === t2.windowBits && (t2.windowBits = -15)), !(0 <= t2.windowBits && t2.windowBits < 16) || e2 && e2.windowBits || (t2.windowBits += 32), 15 < t2.windowBits && t2.windowBits < 48 && 0 == (15 & t2.windowBits) && (t2.windowBits |= 15), this.err = 0, this.msg = "", this.ended = false, this.chunks = [], this.strm = new i(), this.strm.avail_out = 0;
          var r2 = c.inflateInit2(this.strm, t2.windowBits);
          if (r2 !== m.Z_OK) throw new Error(n[r2]);
          this.header = new s(), c.inflateGetHeader(this.strm, this.header);
        }
        function o(e2, t2) {
          var r2 = new a(t2);
          if (r2.push(e2, true), r2.err) throw r2.msg || n[r2.err];
          return r2.result;
        }
        a.prototype.push = function(e2, t2) {
          var r2, n2, i2, s2, a2, o2, h = this.strm, u = this.options.chunkSize, l = this.options.dictionary, f = false;
          if (this.ended) return false;
          n2 = t2 === ~~t2 ? t2 : true === t2 ? m.Z_FINISH : m.Z_NO_FLUSH, "string" == typeof e2 ? h.input = p.binstring2buf(e2) : "[object ArrayBuffer]" === _.call(e2) ? h.input = new Uint8Array(e2) : h.input = e2, h.next_in = 0, h.avail_in = h.input.length;
          do {
            if (0 === h.avail_out && (h.output = new d.Buf8(u), h.next_out = 0, h.avail_out = u), (r2 = c.inflate(h, m.Z_NO_FLUSH)) === m.Z_NEED_DICT && l && (o2 = "string" == typeof l ? p.string2buf(l) : "[object ArrayBuffer]" === _.call(l) ? new Uint8Array(l) : l, r2 = c.inflateSetDictionary(this.strm, o2)), r2 === m.Z_BUF_ERROR && true === f && (r2 = m.Z_OK, f = false), r2 !== m.Z_STREAM_END && r2 !== m.Z_OK) return this.onEnd(r2), !(this.ended = true);
            h.next_out && (0 !== h.avail_out && r2 !== m.Z_STREAM_END && (0 !== h.avail_in || n2 !== m.Z_FINISH && n2 !== m.Z_SYNC_FLUSH) || ("string" === this.options.to ? (i2 = p.utf8border(h.output, h.next_out), s2 = h.next_out - i2, a2 = p.buf2string(h.output, i2), h.next_out = s2, h.avail_out = u - s2, s2 && d.arraySet(h.output, h.output, i2, s2, 0), this.onData(a2)) : this.onData(d.shrinkBuf(h.output, h.next_out)))), 0 === h.avail_in && 0 === h.avail_out && (f = true);
          } while ((0 < h.avail_in || 0 === h.avail_out) && r2 !== m.Z_STREAM_END);
          return r2 === m.Z_STREAM_END && (n2 = m.Z_FINISH), n2 === m.Z_FINISH ? (r2 = c.inflateEnd(this.strm), this.onEnd(r2), this.ended = true, r2 === m.Z_OK) : n2 !== m.Z_SYNC_FLUSH || (this.onEnd(m.Z_OK), !(h.avail_out = 0));
        }, a.prototype.onData = function(e2) {
          this.chunks.push(e2);
        }, a.prototype.onEnd = function(e2) {
          e2 === m.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = d.flattenChunks(this.chunks)), this.chunks = [], this.err = e2, this.msg = this.strm.msg;
        }, r.Inflate = a, r.inflate = o, r.inflateRaw = function(e2, t2) {
          return (t2 = t2 || {}).raw = true, o(e2, t2);
        }, r.ungzip = o;
      }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(e, t, r) {
        var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;
        r.assign = function(e2) {
          for (var t2 = Array.prototype.slice.call(arguments, 1); t2.length; ) {
            var r2 = t2.shift();
            if (r2) {
              if ("object" != typeof r2) throw new TypeError(r2 + "must be non-object");
              for (var n2 in r2) r2.hasOwnProperty(n2) && (e2[n2] = r2[n2]);
            }
          }
          return e2;
        }, r.shrinkBuf = function(e2, t2) {
          return e2.length === t2 ? e2 : e2.subarray ? e2.subarray(0, t2) : (e2.length = t2, e2);
        };
        var i = { arraySet: function(e2, t2, r2, n2, i2) {
          if (t2.subarray && e2.subarray) e2.set(t2.subarray(r2, r2 + n2), i2);
          else for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
        }, flattenChunks: function(e2) {
          var t2, r2, n2, i2, s2, a;
          for (t2 = n2 = 0, r2 = e2.length; t2 < r2; t2++) n2 += e2[t2].length;
          for (a = new Uint8Array(n2), t2 = i2 = 0, r2 = e2.length; t2 < r2; t2++) s2 = e2[t2], a.set(s2, i2), i2 += s2.length;
          return a;
        } }, s = { arraySet: function(e2, t2, r2, n2, i2) {
          for (var s2 = 0; s2 < n2; s2++) e2[i2 + s2] = t2[r2 + s2];
        }, flattenChunks: function(e2) {
          return [].concat.apply([], e2);
        } };
        r.setTyped = function(e2) {
          e2 ? (r.Buf8 = Uint8Array, r.Buf16 = Uint16Array, r.Buf32 = Int32Array, r.assign(r, i)) : (r.Buf8 = Array, r.Buf16 = Array, r.Buf32 = Array, r.assign(r, s));
        }, r.setTyped(n);
      }, {}], 42: [function(e, t, r) {
        var h = e("./common"), i = true, s = true;
        try {
          String.fromCharCode.apply(null, [0]);
        } catch (e2) {
          i = false;
        }
        try {
          String.fromCharCode.apply(null, new Uint8Array(1));
        } catch (e2) {
          s = false;
        }
        for (var u = new h.Buf8(256), n = 0; n < 256; n++) u[n] = 252 <= n ? 6 : 248 <= n ? 5 : 240 <= n ? 4 : 224 <= n ? 3 : 192 <= n ? 2 : 1;
        function l(e2, t2) {
          if (t2 < 65537 && (e2.subarray && s || !e2.subarray && i)) return String.fromCharCode.apply(null, h.shrinkBuf(e2, t2));
          for (var r2 = "", n2 = 0; n2 < t2; n2++) r2 += String.fromCharCode(e2[n2]);
          return r2;
        }
        u[254] = u[254] = 1, r.string2buf = function(e2) {
          var t2, r2, n2, i2, s2, a = e2.length, o = 0;
          for (i2 = 0; i2 < a; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), o += r2 < 128 ? 1 : r2 < 2048 ? 2 : r2 < 65536 ? 3 : 4;
          for (t2 = new h.Buf8(o), i2 = s2 = 0; s2 < o; i2++) 55296 == (64512 & (r2 = e2.charCodeAt(i2))) && i2 + 1 < a && 56320 == (64512 & (n2 = e2.charCodeAt(i2 + 1))) && (r2 = 65536 + (r2 - 55296 << 10) + (n2 - 56320), i2++), r2 < 128 ? t2[s2++] = r2 : (r2 < 2048 ? t2[s2++] = 192 | r2 >>> 6 : (r2 < 65536 ? t2[s2++] = 224 | r2 >>> 12 : (t2[s2++] = 240 | r2 >>> 18, t2[s2++] = 128 | r2 >>> 12 & 63), t2[s2++] = 128 | r2 >>> 6 & 63), t2[s2++] = 128 | 63 & r2);
          return t2;
        }, r.buf2binstring = function(e2) {
          return l(e2, e2.length);
        }, r.binstring2buf = function(e2) {
          for (var t2 = new h.Buf8(e2.length), r2 = 0, n2 = t2.length; r2 < n2; r2++) t2[r2] = e2.charCodeAt(r2);
          return t2;
        }, r.buf2string = function(e2, t2) {
          var r2, n2, i2, s2, a = t2 || e2.length, o = new Array(2 * a);
          for (r2 = n2 = 0; r2 < a; ) if ((i2 = e2[r2++]) < 128) o[n2++] = i2;
          else if (4 < (s2 = u[i2])) o[n2++] = 65533, r2 += s2 - 1;
          else {
            for (i2 &= 2 === s2 ? 31 : 3 === s2 ? 15 : 7; 1 < s2 && r2 < a; ) i2 = i2 << 6 | 63 & e2[r2++], s2--;
            1 < s2 ? o[n2++] = 65533 : i2 < 65536 ? o[n2++] = i2 : (i2 -= 65536, o[n2++] = 55296 | i2 >> 10 & 1023, o[n2++] = 56320 | 1023 & i2);
          }
          return l(o, n2);
        }, r.utf8border = function(e2, t2) {
          var r2;
          for ((t2 = t2 || e2.length) > e2.length && (t2 = e2.length), r2 = t2 - 1; 0 <= r2 && 128 == (192 & e2[r2]); ) r2--;
          return r2 < 0 ? t2 : 0 === r2 ? t2 : r2 + u[e2[r2]] > t2 ? r2 : t2;
        };
      }, { "./common": 41 }], 43: [function(e, t, r) {
        t.exports = function(e2, t2, r2, n) {
          for (var i = 65535 & e2 | 0, s = e2 >>> 16 & 65535 | 0, a = 0; 0 !== r2; ) {
            for (r2 -= a = 2e3 < r2 ? 2e3 : r2; s = s + (i = i + t2[n++] | 0) | 0, --a; ) ;
            i %= 65521, s %= 65521;
          }
          return i | s << 16 | 0;
        };
      }, {}], 44: [function(e, t, r) {
        t.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
      }, {}], 45: [function(e, t, r) {
        var o = (function() {
          for (var e2, t2 = [], r2 = 0; r2 < 256; r2++) {
            e2 = r2;
            for (var n = 0; n < 8; n++) e2 = 1 & e2 ? 3988292384 ^ e2 >>> 1 : e2 >>> 1;
            t2[r2] = e2;
          }
          return t2;
        })();
        t.exports = function(e2, t2, r2, n) {
          var i = o, s = n + r2;
          e2 ^= -1;
          for (var a = n; a < s; a++) e2 = e2 >>> 8 ^ i[255 & (e2 ^ t2[a])];
          return -1 ^ e2;
        };
      }, {}], 46: [function(e, t, r) {
        var h, c = e("../utils/common"), u = e("./trees"), d = e("./adler32"), p = e("./crc32"), n = e("./messages"), l = 0, f = 4, m = 0, _ = -2, g = -1, b = 4, i = 2, v = 8, y = 9, s = 286, a = 30, o = 19, w = 2 * s + 1, k = 15, x = 3, S = 258, z = S + x + 1, C = 42, E2 = 113, A = 1, I = 2, O = 3, B2 = 4;
        function R(e2, t2) {
          return e2.msg = n[t2], t2;
        }
        function T2(e2) {
          return (e2 << 1) - (4 < e2 ? 9 : 0);
        }
        function D(e2) {
          for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
        }
        function F(e2) {
          var t2 = e2.state, r2 = t2.pending;
          r2 > e2.avail_out && (r2 = e2.avail_out), 0 !== r2 && (c.arraySet(e2.output, t2.pending_buf, t2.pending_out, r2, e2.next_out), e2.next_out += r2, t2.pending_out += r2, e2.total_out += r2, e2.avail_out -= r2, t2.pending -= r2, 0 === t2.pending && (t2.pending_out = 0));
        }
        function N(e2, t2) {
          u._tr_flush_block(e2, 0 <= e2.block_start ? e2.block_start : -1, e2.strstart - e2.block_start, t2), e2.block_start = e2.strstart, F(e2.strm);
        }
        function U(e2, t2) {
          e2.pending_buf[e2.pending++] = t2;
        }
        function P2(e2, t2) {
          e2.pending_buf[e2.pending++] = t2 >>> 8 & 255, e2.pending_buf[e2.pending++] = 255 & t2;
        }
        function L(e2, t2) {
          var r2, n2, i2 = e2.max_chain_length, s2 = e2.strstart, a2 = e2.prev_length, o2 = e2.nice_match, h2 = e2.strstart > e2.w_size - z ? e2.strstart - (e2.w_size - z) : 0, u2 = e2.window, l2 = e2.w_mask, f2 = e2.prev, c2 = e2.strstart + S, d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
          e2.prev_length >= e2.good_match && (i2 >>= 2), o2 > e2.lookahead && (o2 = e2.lookahead);
          do {
            if (u2[(r2 = t2) + a2] === p2 && u2[r2 + a2 - 1] === d2 && u2[r2] === u2[s2] && u2[++r2] === u2[s2 + 1]) {
              s2 += 2, r2++;
              do {
              } while (u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && u2[++s2] === u2[++r2] && s2 < c2);
              if (n2 = S - (c2 - s2), s2 = c2 - S, a2 < n2) {
                if (e2.match_start = t2, o2 <= (a2 = n2)) break;
                d2 = u2[s2 + a2 - 1], p2 = u2[s2 + a2];
              }
            }
          } while ((t2 = f2[t2 & l2]) > h2 && 0 != --i2);
          return a2 <= e2.lookahead ? a2 : e2.lookahead;
        }
        function j(e2) {
          var t2, r2, n2, i2, s2, a2, o2, h2, u2, l2, f2 = e2.w_size;
          do {
            if (i2 = e2.window_size - e2.lookahead - e2.strstart, e2.strstart >= f2 + (f2 - z)) {
              for (c.arraySet(e2.window, e2.window, f2, f2, 0), e2.match_start -= f2, e2.strstart -= f2, e2.block_start -= f2, t2 = r2 = e2.hash_size; n2 = e2.head[--t2], e2.head[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
              for (t2 = r2 = f2; n2 = e2.prev[--t2], e2.prev[t2] = f2 <= n2 ? n2 - f2 : 0, --r2; ) ;
              i2 += f2;
            }
            if (0 === e2.strm.avail_in) break;
            if (a2 = e2.strm, o2 = e2.window, h2 = e2.strstart + e2.lookahead, u2 = i2, l2 = void 0, l2 = a2.avail_in, u2 < l2 && (l2 = u2), r2 = 0 === l2 ? 0 : (a2.avail_in -= l2, c.arraySet(o2, a2.input, a2.next_in, l2, h2), 1 === a2.state.wrap ? a2.adler = d(a2.adler, o2, l2, h2) : 2 === a2.state.wrap && (a2.adler = p(a2.adler, o2, l2, h2)), a2.next_in += l2, a2.total_in += l2, l2), e2.lookahead += r2, e2.lookahead + e2.insert >= x) for (s2 = e2.strstart - e2.insert, e2.ins_h = e2.window[s2], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + 1]) & e2.hash_mask; e2.insert && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[s2 + x - 1]) & e2.hash_mask, e2.prev[s2 & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = s2, s2++, e2.insert--, !(e2.lookahead + e2.insert < x)); ) ;
          } while (e2.lookahead < z && 0 !== e2.strm.avail_in);
        }
        function Z(e2, t2) {
          for (var r2, n2; ; ) {
            if (e2.lookahead < z) {
              if (j(e2), e2.lookahead < z && t2 === l) return A;
              if (0 === e2.lookahead) break;
            }
            if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 !== r2 && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2)), e2.match_length >= x) if (n2 = u._tr_tally(e2, e2.strstart - e2.match_start, e2.match_length - x), e2.lookahead -= e2.match_length, e2.match_length <= e2.max_lazy_match && e2.lookahead >= x) {
              for (e2.match_length--; e2.strstart++, e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart, 0 != --e2.match_length; ) ;
              e2.strstart++;
            } else e2.strstart += e2.match_length, e2.match_length = 0, e2.ins_h = e2.window[e2.strstart], e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + 1]) & e2.hash_mask;
            else n2 = u._tr_tally(e2, 0, e2.window[e2.strstart]), e2.lookahead--, e2.strstart++;
            if (n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
          }
          return e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B2) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
        }
        function W(e2, t2) {
          for (var r2, n2, i2; ; ) {
            if (e2.lookahead < z) {
              if (j(e2), e2.lookahead < z && t2 === l) return A;
              if (0 === e2.lookahead) break;
            }
            if (r2 = 0, e2.lookahead >= x && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), e2.prev_length = e2.match_length, e2.prev_match = e2.match_start, e2.match_length = x - 1, 0 !== r2 && e2.prev_length < e2.max_lazy_match && e2.strstart - r2 <= e2.w_size - z && (e2.match_length = L(e2, r2), e2.match_length <= 5 && (1 === e2.strategy || e2.match_length === x && 4096 < e2.strstart - e2.match_start) && (e2.match_length = x - 1)), e2.prev_length >= x && e2.match_length <= e2.prev_length) {
              for (i2 = e2.strstart + e2.lookahead - x, n2 = u._tr_tally(e2, e2.strstart - 1 - e2.prev_match, e2.prev_length - x), e2.lookahead -= e2.prev_length - 1, e2.prev_length -= 2; ++e2.strstart <= i2 && (e2.ins_h = (e2.ins_h << e2.hash_shift ^ e2.window[e2.strstart + x - 1]) & e2.hash_mask, r2 = e2.prev[e2.strstart & e2.w_mask] = e2.head[e2.ins_h], e2.head[e2.ins_h] = e2.strstart), 0 != --e2.prev_length; ) ;
              if (e2.match_available = 0, e2.match_length = x - 1, e2.strstart++, n2 && (N(e2, false), 0 === e2.strm.avail_out)) return A;
            } else if (e2.match_available) {
              if ((n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1])) && N(e2, false), e2.strstart++, e2.lookahead--, 0 === e2.strm.avail_out) return A;
            } else e2.match_available = 1, e2.strstart++, e2.lookahead--;
          }
          return e2.match_available && (n2 = u._tr_tally(e2, 0, e2.window[e2.strstart - 1]), e2.match_available = 0), e2.insert = e2.strstart < x - 1 ? e2.strstart : x - 1, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B2) : e2.last_lit && (N(e2, false), 0 === e2.strm.avail_out) ? A : I;
        }
        function M(e2, t2, r2, n2, i2) {
          this.good_length = e2, this.max_lazy = t2, this.nice_length = r2, this.max_chain = n2, this.func = i2;
        }
        function H2() {
          this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = v, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new c.Buf16(2 * w), this.dyn_dtree = new c.Buf16(2 * (2 * a + 1)), this.bl_tree = new c.Buf16(2 * (2 * o + 1)), D(this.dyn_ltree), D(this.dyn_dtree), D(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new c.Buf16(k + 1), this.heap = new c.Buf16(2 * s + 1), D(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new c.Buf16(2 * s + 1), D(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
        }
        function G2(e2) {
          var t2;
          return e2 && e2.state ? (e2.total_in = e2.total_out = 0, e2.data_type = i, (t2 = e2.state).pending = 0, t2.pending_out = 0, t2.wrap < 0 && (t2.wrap = -t2.wrap), t2.status = t2.wrap ? C : E2, e2.adler = 2 === t2.wrap ? 0 : 1, t2.last_flush = l, u._tr_init(t2), m) : R(e2, _);
        }
        function K(e2) {
          var t2 = G2(e2);
          return t2 === m && (function(e3) {
            e3.window_size = 2 * e3.w_size, D(e3.head), e3.max_lazy_match = h[e3.level].max_lazy, e3.good_match = h[e3.level].good_length, e3.nice_match = h[e3.level].nice_length, e3.max_chain_length = h[e3.level].max_chain, e3.strstart = 0, e3.block_start = 0, e3.lookahead = 0, e3.insert = 0, e3.match_length = e3.prev_length = x - 1, e3.match_available = 0, e3.ins_h = 0;
          })(e2.state), t2;
        }
        function Y(e2, t2, r2, n2, i2, s2) {
          if (!e2) return _;
          var a2 = 1;
          if (t2 === g && (t2 = 6), n2 < 0 ? (a2 = 0, n2 = -n2) : 15 < n2 && (a2 = 2, n2 -= 16), i2 < 1 || y < i2 || r2 !== v || n2 < 8 || 15 < n2 || t2 < 0 || 9 < t2 || s2 < 0 || b < s2) return R(e2, _);
          8 === n2 && (n2 = 9);
          var o2 = new H2();
          return (e2.state = o2).strm = e2, o2.wrap = a2, o2.gzhead = null, o2.w_bits = n2, o2.w_size = 1 << o2.w_bits, o2.w_mask = o2.w_size - 1, o2.hash_bits = i2 + 7, o2.hash_size = 1 << o2.hash_bits, o2.hash_mask = o2.hash_size - 1, o2.hash_shift = ~~((o2.hash_bits + x - 1) / x), o2.window = new c.Buf8(2 * o2.w_size), o2.head = new c.Buf16(o2.hash_size), o2.prev = new c.Buf16(o2.w_size), o2.lit_bufsize = 1 << i2 + 6, o2.pending_buf_size = 4 * o2.lit_bufsize, o2.pending_buf = new c.Buf8(o2.pending_buf_size), o2.d_buf = 1 * o2.lit_bufsize, o2.l_buf = 3 * o2.lit_bufsize, o2.level = t2, o2.strategy = s2, o2.method = r2, K(e2);
        }
        h = [new M(0, 0, 0, 0, function(e2, t2) {
          var r2 = 65535;
          for (r2 > e2.pending_buf_size - 5 && (r2 = e2.pending_buf_size - 5); ; ) {
            if (e2.lookahead <= 1) {
              if (j(e2), 0 === e2.lookahead && t2 === l) return A;
              if (0 === e2.lookahead) break;
            }
            e2.strstart += e2.lookahead, e2.lookahead = 0;
            var n2 = e2.block_start + r2;
            if ((0 === e2.strstart || e2.strstart >= n2) && (e2.lookahead = e2.strstart - n2, e2.strstart = n2, N(e2, false), 0 === e2.strm.avail_out)) return A;
            if (e2.strstart - e2.block_start >= e2.w_size - z && (N(e2, false), 0 === e2.strm.avail_out)) return A;
          }
          return e2.insert = 0, t2 === f ? (N(e2, true), 0 === e2.strm.avail_out ? O : B2) : (e2.strstart > e2.block_start && (N(e2, false), e2.strm.avail_out), A);
        }), new M(4, 4, 8, 4, Z), new M(4, 5, 16, 8, Z), new M(4, 6, 32, 32, Z), new M(4, 4, 16, 16, W), new M(8, 16, 32, 32, W), new M(8, 16, 128, 128, W), new M(8, 32, 128, 256, W), new M(32, 128, 258, 1024, W), new M(32, 258, 258, 4096, W)], r.deflateInit = function(e2, t2) {
          return Y(e2, t2, v, 15, 8, 0);
        }, r.deflateInit2 = Y, r.deflateReset = K, r.deflateResetKeep = G2, r.deflateSetHeader = function(e2, t2) {
          return e2 && e2.state ? 2 !== e2.state.wrap ? _ : (e2.state.gzhead = t2, m) : _;
        }, r.deflate = function(e2, t2) {
          var r2, n2, i2, s2;
          if (!e2 || !e2.state || 5 < t2 || t2 < 0) return e2 ? R(e2, _) : _;
          if (n2 = e2.state, !e2.output || !e2.input && 0 !== e2.avail_in || 666 === n2.status && t2 !== f) return R(e2, 0 === e2.avail_out ? -5 : _);
          if (n2.strm = e2, r2 = n2.last_flush, n2.last_flush = t2, n2.status === C) if (2 === n2.wrap) e2.adler = 0, U(n2, 31), U(n2, 139), U(n2, 8), n2.gzhead ? (U(n2, (n2.gzhead.text ? 1 : 0) + (n2.gzhead.hcrc ? 2 : 0) + (n2.gzhead.extra ? 4 : 0) + (n2.gzhead.name ? 8 : 0) + (n2.gzhead.comment ? 16 : 0)), U(n2, 255 & n2.gzhead.time), U(n2, n2.gzhead.time >> 8 & 255), U(n2, n2.gzhead.time >> 16 & 255), U(n2, n2.gzhead.time >> 24 & 255), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 255 & n2.gzhead.os), n2.gzhead.extra && n2.gzhead.extra.length && (U(n2, 255 & n2.gzhead.extra.length), U(n2, n2.gzhead.extra.length >> 8 & 255)), n2.gzhead.hcrc && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending, 0)), n2.gzindex = 0, n2.status = 69) : (U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 0), U(n2, 9 === n2.level ? 2 : 2 <= n2.strategy || n2.level < 2 ? 4 : 0), U(n2, 3), n2.status = E2);
          else {
            var a2 = v + (n2.w_bits - 8 << 4) << 8;
            a2 |= (2 <= n2.strategy || n2.level < 2 ? 0 : n2.level < 6 ? 1 : 6 === n2.level ? 2 : 3) << 6, 0 !== n2.strstart && (a2 |= 32), a2 += 31 - a2 % 31, n2.status = E2, P2(n2, a2), 0 !== n2.strstart && (P2(n2, e2.adler >>> 16), P2(n2, 65535 & e2.adler)), e2.adler = 1;
          }
          if (69 === n2.status) if (n2.gzhead.extra) {
            for (i2 = n2.pending; n2.gzindex < (65535 & n2.gzhead.extra.length) && (n2.pending !== n2.pending_buf_size || (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending !== n2.pending_buf_size)); ) U(n2, 255 & n2.gzhead.extra[n2.gzindex]), n2.gzindex++;
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), n2.gzindex === n2.gzhead.extra.length && (n2.gzindex = 0, n2.status = 73);
          } else n2.status = 73;
          if (73 === n2.status) if (n2.gzhead.name) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.name.length ? 255 & n2.gzhead.name.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.gzindex = 0, n2.status = 91);
          } else n2.status = 91;
          if (91 === n2.status) if (n2.gzhead.comment) {
            i2 = n2.pending;
            do {
              if (n2.pending === n2.pending_buf_size && (n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), F(e2), i2 = n2.pending, n2.pending === n2.pending_buf_size)) {
                s2 = 1;
                break;
              }
              s2 = n2.gzindex < n2.gzhead.comment.length ? 255 & n2.gzhead.comment.charCodeAt(n2.gzindex++) : 0, U(n2, s2);
            } while (0 !== s2);
            n2.gzhead.hcrc && n2.pending > i2 && (e2.adler = p(e2.adler, n2.pending_buf, n2.pending - i2, i2)), 0 === s2 && (n2.status = 103);
          } else n2.status = 103;
          if (103 === n2.status && (n2.gzhead.hcrc ? (n2.pending + 2 > n2.pending_buf_size && F(e2), n2.pending + 2 <= n2.pending_buf_size && (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), e2.adler = 0, n2.status = E2)) : n2.status = E2), 0 !== n2.pending) {
            if (F(e2), 0 === e2.avail_out) return n2.last_flush = -1, m;
          } else if (0 === e2.avail_in && T2(t2) <= T2(r2) && t2 !== f) return R(e2, -5);
          if (666 === n2.status && 0 !== e2.avail_in) return R(e2, -5);
          if (0 !== e2.avail_in || 0 !== n2.lookahead || t2 !== l && 666 !== n2.status) {
            var o2 = 2 === n2.strategy ? (function(e3, t3) {
              for (var r3; ; ) {
                if (0 === e3.lookahead && (j(e3), 0 === e3.lookahead)) {
                  if (t3 === l) return A;
                  break;
                }
                if (e3.match_length = 0, r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++, r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
              }
              return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B2) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
            })(n2, t2) : 3 === n2.strategy ? (function(e3, t3) {
              for (var r3, n3, i3, s3, a3 = e3.window; ; ) {
                if (e3.lookahead <= S) {
                  if (j(e3), e3.lookahead <= S && t3 === l) return A;
                  if (0 === e3.lookahead) break;
                }
                if (e3.match_length = 0, e3.lookahead >= x && 0 < e3.strstart && (n3 = a3[i3 = e3.strstart - 1]) === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3]) {
                  s3 = e3.strstart + S;
                  do {
                  } while (n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && n3 === a3[++i3] && i3 < s3);
                  e3.match_length = S - (s3 - i3), e3.match_length > e3.lookahead && (e3.match_length = e3.lookahead);
                }
                if (e3.match_length >= x ? (r3 = u._tr_tally(e3, 1, e3.match_length - x), e3.lookahead -= e3.match_length, e3.strstart += e3.match_length, e3.match_length = 0) : (r3 = u._tr_tally(e3, 0, e3.window[e3.strstart]), e3.lookahead--, e3.strstart++), r3 && (N(e3, false), 0 === e3.strm.avail_out)) return A;
              }
              return e3.insert = 0, t3 === f ? (N(e3, true), 0 === e3.strm.avail_out ? O : B2) : e3.last_lit && (N(e3, false), 0 === e3.strm.avail_out) ? A : I;
            })(n2, t2) : h[n2.level].func(n2, t2);
            if (o2 !== O && o2 !== B2 || (n2.status = 666), o2 === A || o2 === O) return 0 === e2.avail_out && (n2.last_flush = -1), m;
            if (o2 === I && (1 === t2 ? u._tr_align(n2) : 5 !== t2 && (u._tr_stored_block(n2, 0, 0, false), 3 === t2 && (D(n2.head), 0 === n2.lookahead && (n2.strstart = 0, n2.block_start = 0, n2.insert = 0))), F(e2), 0 === e2.avail_out)) return n2.last_flush = -1, m;
          }
          return t2 !== f ? m : n2.wrap <= 0 ? 1 : (2 === n2.wrap ? (U(n2, 255 & e2.adler), U(n2, e2.adler >> 8 & 255), U(n2, e2.adler >> 16 & 255), U(n2, e2.adler >> 24 & 255), U(n2, 255 & e2.total_in), U(n2, e2.total_in >> 8 & 255), U(n2, e2.total_in >> 16 & 255), U(n2, e2.total_in >> 24 & 255)) : (P2(n2, e2.adler >>> 16), P2(n2, 65535 & e2.adler)), F(e2), 0 < n2.wrap && (n2.wrap = -n2.wrap), 0 !== n2.pending ? m : 1);
        }, r.deflateEnd = function(e2) {
          var t2;
          return e2 && e2.state ? (t2 = e2.state.status) !== C && 69 !== t2 && 73 !== t2 && 91 !== t2 && 103 !== t2 && t2 !== E2 && 666 !== t2 ? R(e2, _) : (e2.state = null, t2 === E2 ? R(e2, -3) : m) : _;
        }, r.deflateSetDictionary = function(e2, t2) {
          var r2, n2, i2, s2, a2, o2, h2, u2, l2 = t2.length;
          if (!e2 || !e2.state) return _;
          if (2 === (s2 = (r2 = e2.state).wrap) || 1 === s2 && r2.status !== C || r2.lookahead) return _;
          for (1 === s2 && (e2.adler = d(e2.adler, t2, l2, 0)), r2.wrap = 0, l2 >= r2.w_size && (0 === s2 && (D(r2.head), r2.strstart = 0, r2.block_start = 0, r2.insert = 0), u2 = new c.Buf8(r2.w_size), c.arraySet(u2, t2, l2 - r2.w_size, r2.w_size, 0), t2 = u2, l2 = r2.w_size), a2 = e2.avail_in, o2 = e2.next_in, h2 = e2.input, e2.avail_in = l2, e2.next_in = 0, e2.input = t2, j(r2); r2.lookahead >= x; ) {
            for (n2 = r2.strstart, i2 = r2.lookahead - (x - 1); r2.ins_h = (r2.ins_h << r2.hash_shift ^ r2.window[n2 + x - 1]) & r2.hash_mask, r2.prev[n2 & r2.w_mask] = r2.head[r2.ins_h], r2.head[r2.ins_h] = n2, n2++, --i2; ) ;
            r2.strstart = n2, r2.lookahead = x - 1, j(r2);
          }
          return r2.strstart += r2.lookahead, r2.block_start = r2.strstart, r2.insert = r2.lookahead, r2.lookahead = 0, r2.match_length = r2.prev_length = x - 1, r2.match_available = 0, e2.next_in = o2, e2.input = h2, e2.avail_in = a2, r2.wrap = s2, m;
        }, r.deflateInfo = "pako deflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(e, t, r) {
        t.exports = function() {
          this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = false;
        };
      }, {}], 48: [function(e, t, r) {
        t.exports = function(e2, t2) {
          var r2, n, i, s, a, o, h, u, l, f, c, d, p, m, _, g, b, v, y, w, k, x, S, z, C;
          r2 = e2.state, n = e2.next_in, z = e2.input, i = n + (e2.avail_in - 5), s = e2.next_out, C = e2.output, a = s - (t2 - e2.avail_out), o = s + (e2.avail_out - 257), h = r2.dmax, u = r2.wsize, l = r2.whave, f = r2.wnext, c = r2.window, d = r2.hold, p = r2.bits, m = r2.lencode, _ = r2.distcode, g = (1 << r2.lenbits) - 1, b = (1 << r2.distbits) - 1;
          e: do {
            p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = m[d & g];
            t: for (; ; ) {
              if (d >>>= y = v >>> 24, p -= y, 0 === (y = v >>> 16 & 255)) C[s++] = 65535 & v;
              else {
                if (!(16 & y)) {
                  if (0 == (64 & y)) {
                    v = m[(65535 & v) + (d & (1 << y) - 1)];
                    continue t;
                  }
                  if (32 & y) {
                    r2.mode = 12;
                    break e;
                  }
                  e2.msg = "invalid literal/length code", r2.mode = 30;
                  break e;
                }
                w = 65535 & v, (y &= 15) && (p < y && (d += z[n++] << p, p += 8), w += d & (1 << y) - 1, d >>>= y, p -= y), p < 15 && (d += z[n++] << p, p += 8, d += z[n++] << p, p += 8), v = _[d & b];
                r: for (; ; ) {
                  if (d >>>= y = v >>> 24, p -= y, !(16 & (y = v >>> 16 & 255))) {
                    if (0 == (64 & y)) {
                      v = _[(65535 & v) + (d & (1 << y) - 1)];
                      continue r;
                    }
                    e2.msg = "invalid distance code", r2.mode = 30;
                    break e;
                  }
                  if (k = 65535 & v, p < (y &= 15) && (d += z[n++] << p, (p += 8) < y && (d += z[n++] << p, p += 8)), h < (k += d & (1 << y) - 1)) {
                    e2.msg = "invalid distance too far back", r2.mode = 30;
                    break e;
                  }
                  if (d >>>= y, p -= y, (y = s - a) < k) {
                    if (l < (y = k - y) && r2.sane) {
                      e2.msg = "invalid distance too far back", r2.mode = 30;
                      break e;
                    }
                    if (S = c, (x = 0) === f) {
                      if (x += u - y, y < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        x = s - k, S = C;
                      }
                    } else if (f < y) {
                      if (x += u + f - y, (y -= f) < w) {
                        for (w -= y; C[s++] = c[x++], --y; ) ;
                        if (x = 0, f < w) {
                          for (w -= y = f; C[s++] = c[x++], --y; ) ;
                          x = s - k, S = C;
                        }
                      }
                    } else if (x += f - y, y < w) {
                      for (w -= y; C[s++] = c[x++], --y; ) ;
                      x = s - k, S = C;
                    }
                    for (; 2 < w; ) C[s++] = S[x++], C[s++] = S[x++], C[s++] = S[x++], w -= 3;
                    w && (C[s++] = S[x++], 1 < w && (C[s++] = S[x++]));
                  } else {
                    for (x = s - k; C[s++] = C[x++], C[s++] = C[x++], C[s++] = C[x++], 2 < (w -= 3); ) ;
                    w && (C[s++] = C[x++], 1 < w && (C[s++] = C[x++]));
                  }
                  break;
                }
              }
              break;
            }
          } while (n < i && s < o);
          n -= w = p >> 3, d &= (1 << (p -= w << 3)) - 1, e2.next_in = n, e2.next_out = s, e2.avail_in = n < i ? i - n + 5 : 5 - (n - i), e2.avail_out = s < o ? o - s + 257 : 257 - (s - o), r2.hold = d, r2.bits = p;
        };
      }, {}], 49: [function(e, t, r) {
        var I = e("../utils/common"), O = e("./adler32"), B2 = e("./crc32"), R = e("./inffast"), T2 = e("./inftrees"), D = 1, F = 2, N = 0, U = -2, P2 = 1, n = 852, i = 592;
        function L(e2) {
          return (e2 >>> 24 & 255) + (e2 >>> 8 & 65280) + ((65280 & e2) << 8) + ((255 & e2) << 24);
        }
        function s() {
          this.mode = 0, this.last = false, this.wrap = 0, this.havedict = false, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new I.Buf16(320), this.work = new I.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
        }
        function a(e2) {
          var t2;
          return e2 && e2.state ? (t2 = e2.state, e2.total_in = e2.total_out = t2.total = 0, e2.msg = "", t2.wrap && (e2.adler = 1 & t2.wrap), t2.mode = P2, t2.last = 0, t2.havedict = 0, t2.dmax = 32768, t2.head = null, t2.hold = 0, t2.bits = 0, t2.lencode = t2.lendyn = new I.Buf32(n), t2.distcode = t2.distdyn = new I.Buf32(i), t2.sane = 1, t2.back = -1, N) : U;
        }
        function o(e2) {
          var t2;
          return e2 && e2.state ? ((t2 = e2.state).wsize = 0, t2.whave = 0, t2.wnext = 0, a(e2)) : U;
        }
        function h(e2, t2) {
          var r2, n2;
          return e2 && e2.state ? (n2 = e2.state, t2 < 0 ? (r2 = 0, t2 = -t2) : (r2 = 1 + (t2 >> 4), t2 < 48 && (t2 &= 15)), t2 && (t2 < 8 || 15 < t2) ? U : (null !== n2.window && n2.wbits !== t2 && (n2.window = null), n2.wrap = r2, n2.wbits = t2, o(e2))) : U;
        }
        function u(e2, t2) {
          var r2, n2;
          return e2 ? (n2 = new s(), (e2.state = n2).window = null, (r2 = h(e2, t2)) !== N && (e2.state = null), r2) : U;
        }
        var l, f, c = true;
        function j(e2) {
          if (c) {
            var t2;
            for (l = new I.Buf32(512), f = new I.Buf32(32), t2 = 0; t2 < 144; ) e2.lens[t2++] = 8;
            for (; t2 < 256; ) e2.lens[t2++] = 9;
            for (; t2 < 280; ) e2.lens[t2++] = 7;
            for (; t2 < 288; ) e2.lens[t2++] = 8;
            for (T2(D, e2.lens, 0, 288, l, 0, e2.work, { bits: 9 }), t2 = 0; t2 < 32; ) e2.lens[t2++] = 5;
            T2(F, e2.lens, 0, 32, f, 0, e2.work, { bits: 5 }), c = false;
          }
          e2.lencode = l, e2.lenbits = 9, e2.distcode = f, e2.distbits = 5;
        }
        function Z(e2, t2, r2, n2) {
          var i2, s2 = e2.state;
          return null === s2.window && (s2.wsize = 1 << s2.wbits, s2.wnext = 0, s2.whave = 0, s2.window = new I.Buf8(s2.wsize)), n2 >= s2.wsize ? (I.arraySet(s2.window, t2, r2 - s2.wsize, s2.wsize, 0), s2.wnext = 0, s2.whave = s2.wsize) : (n2 < (i2 = s2.wsize - s2.wnext) && (i2 = n2), I.arraySet(s2.window, t2, r2 - n2, i2, s2.wnext), (n2 -= i2) ? (I.arraySet(s2.window, t2, r2 - n2, n2, 0), s2.wnext = n2, s2.whave = s2.wsize) : (s2.wnext += i2, s2.wnext === s2.wsize && (s2.wnext = 0), s2.whave < s2.wsize && (s2.whave += i2))), 0;
        }
        r.inflateReset = o, r.inflateReset2 = h, r.inflateResetKeep = a, r.inflateInit = function(e2) {
          return u(e2, 15);
        }, r.inflateInit2 = u, r.inflate = function(e2, t2) {
          var r2, n2, i2, s2, a2, o2, h2, u2, l2, f2, c2, d, p, m, _, g, b, v, y, w, k, x, S, z, C = 0, E2 = new I.Buf8(4), A = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
          if (!e2 || !e2.state || !e2.output || !e2.input && 0 !== e2.avail_in) return U;
          12 === (r2 = e2.state).mode && (r2.mode = 13), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, f2 = o2, c2 = h2, x = N;
          e: for (; ; ) switch (r2.mode) {
            case P2:
              if (0 === r2.wrap) {
                r2.mode = 13;
                break;
              }
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (2 & r2.wrap && 35615 === u2) {
                E2[r2.check = 0] = 255 & u2, E2[1] = u2 >>> 8 & 255, r2.check = B2(r2.check, E2, 2, 0), l2 = u2 = 0, r2.mode = 2;
                break;
              }
              if (r2.flags = 0, r2.head && (r2.head.done = false), !(1 & r2.wrap) || (((255 & u2) << 8) + (u2 >> 8)) % 31) {
                e2.msg = "incorrect header check", r2.mode = 30;
                break;
              }
              if (8 != (15 & u2)) {
                e2.msg = "unknown compression method", r2.mode = 30;
                break;
              }
              if (l2 -= 4, k = 8 + (15 & (u2 >>>= 4)), 0 === r2.wbits) r2.wbits = k;
              else if (k > r2.wbits) {
                e2.msg = "invalid window size", r2.mode = 30;
                break;
              }
              r2.dmax = 1 << k, e2.adler = r2.check = 1, r2.mode = 512 & u2 ? 10 : 12, l2 = u2 = 0;
              break;
            case 2:
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (r2.flags = u2, 8 != (255 & r2.flags)) {
                e2.msg = "unknown compression method", r2.mode = 30;
                break;
              }
              if (57344 & r2.flags) {
                e2.msg = "unknown header flags set", r2.mode = 30;
                break;
              }
              r2.head && (r2.head.text = u2 >> 8 & 1), 512 & r2.flags && (E2[0] = 255 & u2, E2[1] = u2 >>> 8 & 255, r2.check = B2(r2.check, E2, 2, 0)), l2 = u2 = 0, r2.mode = 3;
            case 3:
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.head && (r2.head.time = u2), 512 & r2.flags && (E2[0] = 255 & u2, E2[1] = u2 >>> 8 & 255, E2[2] = u2 >>> 16 & 255, E2[3] = u2 >>> 24 & 255, r2.check = B2(r2.check, E2, 4, 0)), l2 = u2 = 0, r2.mode = 4;
            case 4:
              for (; l2 < 16; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              r2.head && (r2.head.xflags = 255 & u2, r2.head.os = u2 >> 8), 512 & r2.flags && (E2[0] = 255 & u2, E2[1] = u2 >>> 8 & 255, r2.check = B2(r2.check, E2, 2, 0)), l2 = u2 = 0, r2.mode = 5;
            case 5:
              if (1024 & r2.flags) {
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.length = u2, r2.head && (r2.head.extra_len = u2), 512 & r2.flags && (E2[0] = 255 & u2, E2[1] = u2 >>> 8 & 255, r2.check = B2(r2.check, E2, 2, 0)), l2 = u2 = 0;
              } else r2.head && (r2.head.extra = null);
              r2.mode = 6;
            case 6:
              if (1024 & r2.flags && (o2 < (d = r2.length) && (d = o2), d && (r2.head && (k = r2.head.extra_len - r2.length, r2.head.extra || (r2.head.extra = new Array(r2.head.extra_len)), I.arraySet(r2.head.extra, n2, s2, d, k)), 512 & r2.flags && (r2.check = B2(r2.check, n2, d, s2)), o2 -= d, s2 += d, r2.length -= d), r2.length)) break e;
              r2.length = 0, r2.mode = 7;
            case 7:
              if (2048 & r2.flags) {
                if (0 === o2) break e;
                for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.name += String.fromCharCode(k)), k && d < o2; ) ;
                if (512 & r2.flags && (r2.check = B2(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
              } else r2.head && (r2.head.name = null);
              r2.length = 0, r2.mode = 8;
            case 8:
              if (4096 & r2.flags) {
                if (0 === o2) break e;
                for (d = 0; k = n2[s2 + d++], r2.head && k && r2.length < 65536 && (r2.head.comment += String.fromCharCode(k)), k && d < o2; ) ;
                if (512 & r2.flags && (r2.check = B2(r2.check, n2, d, s2)), o2 -= d, s2 += d, k) break e;
              } else r2.head && (r2.head.comment = null);
              r2.mode = 9;
            case 9:
              if (512 & r2.flags) {
                for (; l2 < 16; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (u2 !== (65535 & r2.check)) {
                  e2.msg = "header crc mismatch", r2.mode = 30;
                  break;
                }
                l2 = u2 = 0;
              }
              r2.head && (r2.head.hcrc = r2.flags >> 9 & 1, r2.head.done = true), e2.adler = r2.check = 0, r2.mode = 12;
              break;
            case 10:
              for (; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              e2.adler = r2.check = L(u2), l2 = u2 = 0, r2.mode = 11;
            case 11:
              if (0 === r2.havedict) return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, 2;
              e2.adler = r2.check = 1, r2.mode = 12;
            case 12:
              if (5 === t2 || 6 === t2) break e;
            case 13:
              if (r2.last) {
                u2 >>>= 7 & l2, l2 -= 7 & l2, r2.mode = 27;
                break;
              }
              for (; l2 < 3; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              switch (r2.last = 1 & u2, l2 -= 1, 3 & (u2 >>>= 1)) {
                case 0:
                  r2.mode = 14;
                  break;
                case 1:
                  if (j(r2), r2.mode = 20, 6 !== t2) break;
                  u2 >>>= 2, l2 -= 2;
                  break e;
                case 2:
                  r2.mode = 17;
                  break;
                case 3:
                  e2.msg = "invalid block type", r2.mode = 30;
              }
              u2 >>>= 2, l2 -= 2;
              break;
            case 14:
              for (u2 >>>= 7 & l2, l2 -= 7 & l2; l2 < 32; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if ((65535 & u2) != (u2 >>> 16 ^ 65535)) {
                e2.msg = "invalid stored block lengths", r2.mode = 30;
                break;
              }
              if (r2.length = 65535 & u2, l2 = u2 = 0, r2.mode = 15, 6 === t2) break e;
            case 15:
              r2.mode = 16;
            case 16:
              if (d = r2.length) {
                if (o2 < d && (d = o2), h2 < d && (d = h2), 0 === d) break e;
                I.arraySet(i2, n2, s2, d, a2), o2 -= d, s2 += d, h2 -= d, a2 += d, r2.length -= d;
                break;
              }
              r2.mode = 12;
              break;
            case 17:
              for (; l2 < 14; ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (r2.nlen = 257 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ndist = 1 + (31 & u2), u2 >>>= 5, l2 -= 5, r2.ncode = 4 + (15 & u2), u2 >>>= 4, l2 -= 4, 286 < r2.nlen || 30 < r2.ndist) {
                e2.msg = "too many length or distance symbols", r2.mode = 30;
                break;
              }
              r2.have = 0, r2.mode = 18;
            case 18:
              for (; r2.have < r2.ncode; ) {
                for (; l2 < 3; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.lens[A[r2.have++]] = 7 & u2, u2 >>>= 3, l2 -= 3;
              }
              for (; r2.have < 19; ) r2.lens[A[r2.have++]] = 0;
              if (r2.lencode = r2.lendyn, r2.lenbits = 7, S = { bits: r2.lenbits }, x = T2(0, r2.lens, 0, 19, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                e2.msg = "invalid code lengths set", r2.mode = 30;
                break;
              }
              r2.have = 0, r2.mode = 19;
            case 19:
              for (; r2.have < r2.nlen + r2.ndist; ) {
                for (; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (b < 16) u2 >>>= _, l2 -= _, r2.lens[r2.have++] = b;
                else {
                  if (16 === b) {
                    for (z = _ + 2; l2 < z; ) {
                      if (0 === o2) break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    if (u2 >>>= _, l2 -= _, 0 === r2.have) {
                      e2.msg = "invalid bit length repeat", r2.mode = 30;
                      break;
                    }
                    k = r2.lens[r2.have - 1], d = 3 + (3 & u2), u2 >>>= 2, l2 -= 2;
                  } else if (17 === b) {
                    for (z = _ + 3; l2 < z; ) {
                      if (0 === o2) break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    l2 -= _, k = 0, d = 3 + (7 & (u2 >>>= _)), u2 >>>= 3, l2 -= 3;
                  } else {
                    for (z = _ + 7; l2 < z; ) {
                      if (0 === o2) break e;
                      o2--, u2 += n2[s2++] << l2, l2 += 8;
                    }
                    l2 -= _, k = 0, d = 11 + (127 & (u2 >>>= _)), u2 >>>= 7, l2 -= 7;
                  }
                  if (r2.have + d > r2.nlen + r2.ndist) {
                    e2.msg = "invalid bit length repeat", r2.mode = 30;
                    break;
                  }
                  for (; d--; ) r2.lens[r2.have++] = k;
                }
              }
              if (30 === r2.mode) break;
              if (0 === r2.lens[256]) {
                e2.msg = "invalid code -- missing end-of-block", r2.mode = 30;
                break;
              }
              if (r2.lenbits = 9, S = { bits: r2.lenbits }, x = T2(D, r2.lens, 0, r2.nlen, r2.lencode, 0, r2.work, S), r2.lenbits = S.bits, x) {
                e2.msg = "invalid literal/lengths set", r2.mode = 30;
                break;
              }
              if (r2.distbits = 6, r2.distcode = r2.distdyn, S = { bits: r2.distbits }, x = T2(F, r2.lens, r2.nlen, r2.ndist, r2.distcode, 0, r2.work, S), r2.distbits = S.bits, x) {
                e2.msg = "invalid distances set", r2.mode = 30;
                break;
              }
              if (r2.mode = 20, 6 === t2) break e;
            case 20:
              r2.mode = 21;
            case 21:
              if (6 <= o2 && 258 <= h2) {
                e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, R(e2, c2), a2 = e2.next_out, i2 = e2.output, h2 = e2.avail_out, s2 = e2.next_in, n2 = e2.input, o2 = e2.avail_in, u2 = r2.hold, l2 = r2.bits, 12 === r2.mode && (r2.back = -1);
                break;
              }
              for (r2.back = 0; g = (C = r2.lencode[u2 & (1 << r2.lenbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (g && 0 == (240 & g)) {
                for (v = _, y = g, w = b; g = (C = r2.lencode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                u2 >>>= v, l2 -= v, r2.back += v;
              }
              if (u2 >>>= _, l2 -= _, r2.back += _, r2.length = b, 0 === g) {
                r2.mode = 26;
                break;
              }
              if (32 & g) {
                r2.back = -1, r2.mode = 12;
                break;
              }
              if (64 & g) {
                e2.msg = "invalid literal/length code", r2.mode = 30;
                break;
              }
              r2.extra = 15 & g, r2.mode = 22;
            case 22:
              if (r2.extra) {
                for (z = r2.extra; l2 < z; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.length += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
              }
              r2.was = r2.length, r2.mode = 23;
            case 23:
              for (; g = (C = r2.distcode[u2 & (1 << r2.distbits) - 1]) >>> 16 & 255, b = 65535 & C, !((_ = C >>> 24) <= l2); ) {
                if (0 === o2) break e;
                o2--, u2 += n2[s2++] << l2, l2 += 8;
              }
              if (0 == (240 & g)) {
                for (v = _, y = g, w = b; g = (C = r2.distcode[w + ((u2 & (1 << v + y) - 1) >> v)]) >>> 16 & 255, b = 65535 & C, !(v + (_ = C >>> 24) <= l2); ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                u2 >>>= v, l2 -= v, r2.back += v;
              }
              if (u2 >>>= _, l2 -= _, r2.back += _, 64 & g) {
                e2.msg = "invalid distance code", r2.mode = 30;
                break;
              }
              r2.offset = b, r2.extra = 15 & g, r2.mode = 24;
            case 24:
              if (r2.extra) {
                for (z = r2.extra; l2 < z; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                r2.offset += u2 & (1 << r2.extra) - 1, u2 >>>= r2.extra, l2 -= r2.extra, r2.back += r2.extra;
              }
              if (r2.offset > r2.dmax) {
                e2.msg = "invalid distance too far back", r2.mode = 30;
                break;
              }
              r2.mode = 25;
            case 25:
              if (0 === h2) break e;
              if (d = c2 - h2, r2.offset > d) {
                if ((d = r2.offset - d) > r2.whave && r2.sane) {
                  e2.msg = "invalid distance too far back", r2.mode = 30;
                  break;
                }
                p = d > r2.wnext ? (d -= r2.wnext, r2.wsize - d) : r2.wnext - d, d > r2.length && (d = r2.length), m = r2.window;
              } else m = i2, p = a2 - r2.offset, d = r2.length;
              for (h2 < d && (d = h2), h2 -= d, r2.length -= d; i2[a2++] = m[p++], --d; ) ;
              0 === r2.length && (r2.mode = 21);
              break;
            case 26:
              if (0 === h2) break e;
              i2[a2++] = r2.length, h2--, r2.mode = 21;
              break;
            case 27:
              if (r2.wrap) {
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 |= n2[s2++] << l2, l2 += 8;
                }
                if (c2 -= h2, e2.total_out += c2, r2.total += c2, c2 && (e2.adler = r2.check = r2.flags ? B2(r2.check, i2, c2, a2 - c2) : O(r2.check, i2, c2, a2 - c2)), c2 = h2, (r2.flags ? u2 : L(u2)) !== r2.check) {
                  e2.msg = "incorrect data check", r2.mode = 30;
                  break;
                }
                l2 = u2 = 0;
              }
              r2.mode = 28;
            case 28:
              if (r2.wrap && r2.flags) {
                for (; l2 < 32; ) {
                  if (0 === o2) break e;
                  o2--, u2 += n2[s2++] << l2, l2 += 8;
                }
                if (u2 !== (4294967295 & r2.total)) {
                  e2.msg = "incorrect length check", r2.mode = 30;
                  break;
                }
                l2 = u2 = 0;
              }
              r2.mode = 29;
            case 29:
              x = 1;
              break e;
            case 30:
              x = -3;
              break e;
            case 31:
              return -4;
            case 32:
            default:
              return U;
          }
          return e2.next_out = a2, e2.avail_out = h2, e2.next_in = s2, e2.avail_in = o2, r2.hold = u2, r2.bits = l2, (r2.wsize || c2 !== e2.avail_out && r2.mode < 30 && (r2.mode < 27 || 4 !== t2)) && Z(e2, e2.output, e2.next_out, c2 - e2.avail_out) ? (r2.mode = 31, -4) : (f2 -= e2.avail_in, c2 -= e2.avail_out, e2.total_in += f2, e2.total_out += c2, r2.total += c2, r2.wrap && c2 && (e2.adler = r2.check = r2.flags ? B2(r2.check, i2, c2, e2.next_out - c2) : O(r2.check, i2, c2, e2.next_out - c2)), e2.data_type = r2.bits + (r2.last ? 64 : 0) + (12 === r2.mode ? 128 : 0) + (20 === r2.mode || 15 === r2.mode ? 256 : 0), (0 == f2 && 0 === c2 || 4 === t2) && x === N && (x = -5), x);
        }, r.inflateEnd = function(e2) {
          if (!e2 || !e2.state) return U;
          var t2 = e2.state;
          return t2.window && (t2.window = null), e2.state = null, N;
        }, r.inflateGetHeader = function(e2, t2) {
          var r2;
          return e2 && e2.state ? 0 == (2 & (r2 = e2.state).wrap) ? U : ((r2.head = t2).done = false, N) : U;
        }, r.inflateSetDictionary = function(e2, t2) {
          var r2, n2 = t2.length;
          return e2 && e2.state ? 0 !== (r2 = e2.state).wrap && 11 !== r2.mode ? U : 11 === r2.mode && O(1, t2, n2, 0) !== r2.check ? -3 : Z(e2, t2, n2, n2) ? (r2.mode = 31, -4) : (r2.havedict = 1, N) : U;
        }, r.inflateInfo = "pako inflate (from Nodeca project)";
      }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(e, t, r) {
        var D = e("../utils/common"), F = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], N = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], U = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], P2 = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
        t.exports = function(e2, t2, r2, n, i, s, a, o) {
          var h, u, l, f, c, d, p, m, _, g = o.bits, b = 0, v = 0, y = 0, w = 0, k = 0, x = 0, S = 0, z = 0, C = 0, E2 = 0, A = null, I = 0, O = new D.Buf16(16), B2 = new D.Buf16(16), R = null, T2 = 0;
          for (b = 0; b <= 15; b++) O[b] = 0;
          for (v = 0; v < n; v++) O[t2[r2 + v]]++;
          for (k = g, w = 15; 1 <= w && 0 === O[w]; w--) ;
          if (w < k && (k = w), 0 === w) return i[s++] = 20971520, i[s++] = 20971520, o.bits = 1, 0;
          for (y = 1; y < w && 0 === O[y]; y++) ;
          for (k < y && (k = y), b = z = 1; b <= 15; b++) if (z <<= 1, (z -= O[b]) < 0) return -1;
          if (0 < z && (0 === e2 || 1 !== w)) return -1;
          for (B2[1] = 0, b = 1; b < 15; b++) B2[b + 1] = B2[b] + O[b];
          for (v = 0; v < n; v++) 0 !== t2[r2 + v] && (a[B2[t2[r2 + v]]++] = v);
          if (d = 0 === e2 ? (A = R = a, 19) : 1 === e2 ? (A = F, I -= 257, R = N, T2 -= 257, 256) : (A = U, R = P2, -1), b = y, c = s, S = v = E2 = 0, l = -1, f = (C = 1 << (x = k)) - 1, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
          for (; ; ) {
            for (p = b - S, _ = a[v] < d ? (m = 0, a[v]) : a[v] > d ? (m = R[T2 + a[v]], A[I + a[v]]) : (m = 96, 0), h = 1 << b - S, y = u = 1 << x; i[c + (E2 >> S) + (u -= h)] = p << 24 | m << 16 | _ | 0, 0 !== u; ) ;
            for (h = 1 << b - 1; E2 & h; ) h >>= 1;
            if (0 !== h ? (E2 &= h - 1, E2 += h) : E2 = 0, v++, 0 == --O[b]) {
              if (b === w) break;
              b = t2[r2 + a[v]];
            }
            if (k < b && (E2 & f) !== l) {
              for (0 === S && (S = k), c += y, z = 1 << (x = b - S); x + S < w && !((z -= O[x + S]) <= 0); ) x++, z <<= 1;
              if (C += 1 << x, 1 === e2 && 852 < C || 2 === e2 && 592 < C) return 1;
              i[l = E2 & f] = k << 24 | x << 16 | c - s | 0;
            }
          }
          return 0 !== E2 && (i[c + E2] = b - S << 24 | 64 << 16 | 0), o.bits = k, 0;
        };
      }, { "../utils/common": 41 }], 51: [function(e, t, r) {
        t.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
      }, {}], 52: [function(e, t, r) {
        var i = e("../utils/common"), o = 0, h = 1;
        function n(e2) {
          for (var t2 = e2.length; 0 <= --t2; ) e2[t2] = 0;
        }
        var s = 0, a = 29, u = 256, l = u + 1 + a, f = 30, c = 19, _ = 2 * l + 1, g = 15, d = 16, p = 7, m = 256, b = 16, v = 17, y = 18, w = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], k = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], x = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], S = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], z = new Array(2 * (l + 2));
        n(z);
        var C = new Array(2 * f);
        n(C);
        var E2 = new Array(512);
        n(E2);
        var A = new Array(256);
        n(A);
        var I = new Array(a);
        n(I);
        var O, B2, R, T2 = new Array(f);
        function D(e2, t2, r2, n2, i2) {
          this.static_tree = e2, this.extra_bits = t2, this.extra_base = r2, this.elems = n2, this.max_length = i2, this.has_stree = e2 && e2.length;
        }
        function F(e2, t2) {
          this.dyn_tree = e2, this.max_code = 0, this.stat_desc = t2;
        }
        function N(e2) {
          return e2 < 256 ? E2[e2] : E2[256 + (e2 >>> 7)];
        }
        function U(e2, t2) {
          e2.pending_buf[e2.pending++] = 255 & t2, e2.pending_buf[e2.pending++] = t2 >>> 8 & 255;
        }
        function P2(e2, t2, r2) {
          e2.bi_valid > d - r2 ? (e2.bi_buf |= t2 << e2.bi_valid & 65535, U(e2, e2.bi_buf), e2.bi_buf = t2 >> d - e2.bi_valid, e2.bi_valid += r2 - d) : (e2.bi_buf |= t2 << e2.bi_valid & 65535, e2.bi_valid += r2);
        }
        function L(e2, t2, r2) {
          P2(e2, r2[2 * t2], r2[2 * t2 + 1]);
        }
        function j(e2, t2) {
          for (var r2 = 0; r2 |= 1 & e2, e2 >>>= 1, r2 <<= 1, 0 < --t2; ) ;
          return r2 >>> 1;
        }
        function Z(e2, t2, r2) {
          var n2, i2, s2 = new Array(g + 1), a2 = 0;
          for (n2 = 1; n2 <= g; n2++) s2[n2] = a2 = a2 + r2[n2 - 1] << 1;
          for (i2 = 0; i2 <= t2; i2++) {
            var o2 = e2[2 * i2 + 1];
            0 !== o2 && (e2[2 * i2] = j(s2[o2]++, o2));
          }
        }
        function W(e2) {
          var t2;
          for (t2 = 0; t2 < l; t2++) e2.dyn_ltree[2 * t2] = 0;
          for (t2 = 0; t2 < f; t2++) e2.dyn_dtree[2 * t2] = 0;
          for (t2 = 0; t2 < c; t2++) e2.bl_tree[2 * t2] = 0;
          e2.dyn_ltree[2 * m] = 1, e2.opt_len = e2.static_len = 0, e2.last_lit = e2.matches = 0;
        }
        function M(e2) {
          8 < e2.bi_valid ? U(e2, e2.bi_buf) : 0 < e2.bi_valid && (e2.pending_buf[e2.pending++] = e2.bi_buf), e2.bi_buf = 0, e2.bi_valid = 0;
        }
        function H2(e2, t2, r2, n2) {
          var i2 = 2 * t2, s2 = 2 * r2;
          return e2[i2] < e2[s2] || e2[i2] === e2[s2] && n2[t2] <= n2[r2];
        }
        function G2(e2, t2, r2) {
          for (var n2 = e2.heap[r2], i2 = r2 << 1; i2 <= e2.heap_len && (i2 < e2.heap_len && H2(t2, e2.heap[i2 + 1], e2.heap[i2], e2.depth) && i2++, !H2(t2, n2, e2.heap[i2], e2.depth)); ) e2.heap[r2] = e2.heap[i2], r2 = i2, i2 <<= 1;
          e2.heap[r2] = n2;
        }
        function K(e2, t2, r2) {
          var n2, i2, s2, a2, o2 = 0;
          if (0 !== e2.last_lit) for (; n2 = e2.pending_buf[e2.d_buf + 2 * o2] << 8 | e2.pending_buf[e2.d_buf + 2 * o2 + 1], i2 = e2.pending_buf[e2.l_buf + o2], o2++, 0 === n2 ? L(e2, i2, t2) : (L(e2, (s2 = A[i2]) + u + 1, t2), 0 !== (a2 = w[s2]) && P2(e2, i2 -= I[s2], a2), L(e2, s2 = N(--n2), r2), 0 !== (a2 = k[s2]) && P2(e2, n2 -= T2[s2], a2)), o2 < e2.last_lit; ) ;
          L(e2, m, t2);
        }
        function Y(e2, t2) {
          var r2, n2, i2, s2 = t2.dyn_tree, a2 = t2.stat_desc.static_tree, o2 = t2.stat_desc.has_stree, h2 = t2.stat_desc.elems, u2 = -1;
          for (e2.heap_len = 0, e2.heap_max = _, r2 = 0; r2 < h2; r2++) 0 !== s2[2 * r2] ? (e2.heap[++e2.heap_len] = u2 = r2, e2.depth[r2] = 0) : s2[2 * r2 + 1] = 0;
          for (; e2.heap_len < 2; ) s2[2 * (i2 = e2.heap[++e2.heap_len] = u2 < 2 ? ++u2 : 0)] = 1, e2.depth[i2] = 0, e2.opt_len--, o2 && (e2.static_len -= a2[2 * i2 + 1]);
          for (t2.max_code = u2, r2 = e2.heap_len >> 1; 1 <= r2; r2--) G2(e2, s2, r2);
          for (i2 = h2; r2 = e2.heap[1], e2.heap[1] = e2.heap[e2.heap_len--], G2(e2, s2, 1), n2 = e2.heap[1], e2.heap[--e2.heap_max] = r2, e2.heap[--e2.heap_max] = n2, s2[2 * i2] = s2[2 * r2] + s2[2 * n2], e2.depth[i2] = (e2.depth[r2] >= e2.depth[n2] ? e2.depth[r2] : e2.depth[n2]) + 1, s2[2 * r2 + 1] = s2[2 * n2 + 1] = i2, e2.heap[1] = i2++, G2(e2, s2, 1), 2 <= e2.heap_len; ) ;
          e2.heap[--e2.heap_max] = e2.heap[1], (function(e3, t3) {
            var r3, n3, i3, s3, a3, o3, h3 = t3.dyn_tree, u3 = t3.max_code, l2 = t3.stat_desc.static_tree, f2 = t3.stat_desc.has_stree, c2 = t3.stat_desc.extra_bits, d2 = t3.stat_desc.extra_base, p2 = t3.stat_desc.max_length, m2 = 0;
            for (s3 = 0; s3 <= g; s3++) e3.bl_count[s3] = 0;
            for (h3[2 * e3.heap[e3.heap_max] + 1] = 0, r3 = e3.heap_max + 1; r3 < _; r3++) p2 < (s3 = h3[2 * h3[2 * (n3 = e3.heap[r3]) + 1] + 1] + 1) && (s3 = p2, m2++), h3[2 * n3 + 1] = s3, u3 < n3 || (e3.bl_count[s3]++, a3 = 0, d2 <= n3 && (a3 = c2[n3 - d2]), o3 = h3[2 * n3], e3.opt_len += o3 * (s3 + a3), f2 && (e3.static_len += o3 * (l2[2 * n3 + 1] + a3)));
            if (0 !== m2) {
              do {
                for (s3 = p2 - 1; 0 === e3.bl_count[s3]; ) s3--;
                e3.bl_count[s3]--, e3.bl_count[s3 + 1] += 2, e3.bl_count[p2]--, m2 -= 2;
              } while (0 < m2);
              for (s3 = p2; 0 !== s3; s3--) for (n3 = e3.bl_count[s3]; 0 !== n3; ) u3 < (i3 = e3.heap[--r3]) || (h3[2 * i3 + 1] !== s3 && (e3.opt_len += (s3 - h3[2 * i3 + 1]) * h3[2 * i3], h3[2 * i3 + 1] = s3), n3--);
            }
          })(e2, t2), Z(s2, u2, e2.bl_count);
        }
        function X2(e2, t2, r2) {
          var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
          for (0 === a2 && (h2 = 138, u2 = 3), t2[2 * (r2 + 1) + 1] = 65535, n2 = 0; n2 <= r2; n2++) i2 = a2, a2 = t2[2 * (n2 + 1) + 1], ++o2 < h2 && i2 === a2 || (o2 < u2 ? e2.bl_tree[2 * i2] += o2 : 0 !== i2 ? (i2 !== s2 && e2.bl_tree[2 * i2]++, e2.bl_tree[2 * b]++) : o2 <= 10 ? e2.bl_tree[2 * v]++ : e2.bl_tree[2 * y]++, s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4));
        }
        function V(e2, t2, r2) {
          var n2, i2, s2 = -1, a2 = t2[1], o2 = 0, h2 = 7, u2 = 4;
          for (0 === a2 && (h2 = 138, u2 = 3), n2 = 0; n2 <= r2; n2++) if (i2 = a2, a2 = t2[2 * (n2 + 1) + 1], !(++o2 < h2 && i2 === a2)) {
            if (o2 < u2) for (; L(e2, i2, e2.bl_tree), 0 != --o2; ) ;
            else 0 !== i2 ? (i2 !== s2 && (L(e2, i2, e2.bl_tree), o2--), L(e2, b, e2.bl_tree), P2(e2, o2 - 3, 2)) : o2 <= 10 ? (L(e2, v, e2.bl_tree), P2(e2, o2 - 3, 3)) : (L(e2, y, e2.bl_tree), P2(e2, o2 - 11, 7));
            s2 = i2, u2 = (o2 = 0) === a2 ? (h2 = 138, 3) : i2 === a2 ? (h2 = 6, 3) : (h2 = 7, 4);
          }
        }
        n(T2);
        var q = false;
        function J(e2, t2, r2, n2) {
          P2(e2, (s << 1) + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
            M(e3), U(e3, r3), U(e3, ~r3), i.arraySet(e3.pending_buf, e3.window, t3, r3, e3.pending), e3.pending += r3;
          })(e2, t2, r2);
        }
        r._tr_init = function(e2) {
          q || ((function() {
            var e3, t2, r2, n2, i2, s2 = new Array(g + 1);
            for (n2 = r2 = 0; n2 < a - 1; n2++) for (I[n2] = r2, e3 = 0; e3 < 1 << w[n2]; e3++) A[r2++] = n2;
            for (A[r2 - 1] = n2, n2 = i2 = 0; n2 < 16; n2++) for (T2[n2] = i2, e3 = 0; e3 < 1 << k[n2]; e3++) E2[i2++] = n2;
            for (i2 >>= 7; n2 < f; n2++) for (T2[n2] = i2 << 7, e3 = 0; e3 < 1 << k[n2] - 7; e3++) E2[256 + i2++] = n2;
            for (t2 = 0; t2 <= g; t2++) s2[t2] = 0;
            for (e3 = 0; e3 <= 143; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
            for (; e3 <= 255; ) z[2 * e3 + 1] = 9, e3++, s2[9]++;
            for (; e3 <= 279; ) z[2 * e3 + 1] = 7, e3++, s2[7]++;
            for (; e3 <= 287; ) z[2 * e3 + 1] = 8, e3++, s2[8]++;
            for (Z(z, l + 1, s2), e3 = 0; e3 < f; e3++) C[2 * e3 + 1] = 5, C[2 * e3] = j(e3, 5);
            O = new D(z, w, u + 1, l, g), B2 = new D(C, k, 0, f, g), R = new D(new Array(0), x, 0, c, p);
          })(), q = true), e2.l_desc = new F(e2.dyn_ltree, O), e2.d_desc = new F(e2.dyn_dtree, B2), e2.bl_desc = new F(e2.bl_tree, R), e2.bi_buf = 0, e2.bi_valid = 0, W(e2);
        }, r._tr_stored_block = J, r._tr_flush_block = function(e2, t2, r2, n2) {
          var i2, s2, a2 = 0;
          0 < e2.level ? (2 === e2.strm.data_type && (e2.strm.data_type = (function(e3) {
            var t3, r3 = 4093624447;
            for (t3 = 0; t3 <= 31; t3++, r3 >>>= 1) if (1 & r3 && 0 !== e3.dyn_ltree[2 * t3]) return o;
            if (0 !== e3.dyn_ltree[18] || 0 !== e3.dyn_ltree[20] || 0 !== e3.dyn_ltree[26]) return h;
            for (t3 = 32; t3 < u; t3++) if (0 !== e3.dyn_ltree[2 * t3]) return h;
            return o;
          })(e2)), Y(e2, e2.l_desc), Y(e2, e2.d_desc), a2 = (function(e3) {
            var t3;
            for (X2(e3, e3.dyn_ltree, e3.l_desc.max_code), X2(e3, e3.dyn_dtree, e3.d_desc.max_code), Y(e3, e3.bl_desc), t3 = c - 1; 3 <= t3 && 0 === e3.bl_tree[2 * S[t3] + 1]; t3--) ;
            return e3.opt_len += 3 * (t3 + 1) + 5 + 5 + 4, t3;
          })(e2), i2 = e2.opt_len + 3 + 7 >>> 3, (s2 = e2.static_len + 3 + 7 >>> 3) <= i2 && (i2 = s2)) : i2 = s2 = r2 + 5, r2 + 4 <= i2 && -1 !== t2 ? J(e2, t2, r2, n2) : 4 === e2.strategy || s2 === i2 ? (P2(e2, 2 + (n2 ? 1 : 0), 3), K(e2, z, C)) : (P2(e2, 4 + (n2 ? 1 : 0), 3), (function(e3, t3, r3, n3) {
            var i3;
            for (P2(e3, t3 - 257, 5), P2(e3, r3 - 1, 5), P2(e3, n3 - 4, 4), i3 = 0; i3 < n3; i3++) P2(e3, e3.bl_tree[2 * S[i3] + 1], 3);
            V(e3, e3.dyn_ltree, t3 - 1), V(e3, e3.dyn_dtree, r3 - 1);
          })(e2, e2.l_desc.max_code + 1, e2.d_desc.max_code + 1, a2 + 1), K(e2, e2.dyn_ltree, e2.dyn_dtree)), W(e2), n2 && M(e2);
        }, r._tr_tally = function(e2, t2, r2) {
          return e2.pending_buf[e2.d_buf + 2 * e2.last_lit] = t2 >>> 8 & 255, e2.pending_buf[e2.d_buf + 2 * e2.last_lit + 1] = 255 & t2, e2.pending_buf[e2.l_buf + e2.last_lit] = 255 & r2, e2.last_lit++, 0 === t2 ? e2.dyn_ltree[2 * r2]++ : (e2.matches++, t2--, e2.dyn_ltree[2 * (A[r2] + u + 1)]++, e2.dyn_dtree[2 * N(t2)]++), e2.last_lit === e2.lit_bufsize - 1;
        }, r._tr_align = function(e2) {
          P2(e2, 2, 3), L(e2, m, z), (function(e3) {
            16 === e3.bi_valid ? (U(e3, e3.bi_buf), e3.bi_buf = 0, e3.bi_valid = 0) : 8 <= e3.bi_valid && (e3.pending_buf[e3.pending++] = 255 & e3.bi_buf, e3.bi_buf >>= 8, e3.bi_valid -= 8);
          })(e2);
        };
      }, { "../utils/common": 41 }], 53: [function(e, t, r) {
        t.exports = function() {
          this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
        };
      }, {}], 54: [function(e, t, r) {
        (function(e2) {
          !(function(r2, n) {
            if (!r2.setImmediate) {
              var i, s, t2, a, o = 1, h = {}, u = false, l = r2.document, e3 = Object.getPrototypeOf && Object.getPrototypeOf(r2);
              e3 = e3 && e3.setTimeout ? e3 : r2, i = "[object process]" === {}.toString.call(r2.process) ? function(e4) {
                process.nextTick(function() {
                  c(e4);
                });
              } : (function() {
                if (r2.postMessage && !r2.importScripts) {
                  var e4 = true, t3 = r2.onmessage;
                  return r2.onmessage = function() {
                    e4 = false;
                  }, r2.postMessage("", "*"), r2.onmessage = t3, e4;
                }
              })() ? (a = "setImmediate$" + Math.random() + "$", r2.addEventListener ? r2.addEventListener("message", d, false) : r2.attachEvent("onmessage", d), function(e4) {
                r2.postMessage(a + e4, "*");
              }) : r2.MessageChannel ? ((t2 = new MessageChannel()).port1.onmessage = function(e4) {
                c(e4.data);
              }, function(e4) {
                t2.port2.postMessage(e4);
              }) : l && "onreadystatechange" in l.createElement("script") ? (s = l.documentElement, function(e4) {
                var t3 = l.createElement("script");
                t3.onreadystatechange = function() {
                  c(e4), t3.onreadystatechange = null, s.removeChild(t3), t3 = null;
                }, s.appendChild(t3);
              }) : function(e4) {
                setTimeout(c, 0, e4);
              }, e3.setImmediate = function(e4) {
                "function" != typeof e4 && (e4 = new Function("" + e4));
                for (var t3 = new Array(arguments.length - 1), r3 = 0; r3 < t3.length; r3++) t3[r3] = arguments[r3 + 1];
                var n2 = { callback: e4, args: t3 };
                return h[o] = n2, i(o), o++;
              }, e3.clearImmediate = f;
            }
            function f(e4) {
              delete h[e4];
            }
            function c(e4) {
              if (u) setTimeout(c, 0, e4);
              else {
                var t3 = h[e4];
                if (t3) {
                  u = true;
                  try {
                    !(function(e5) {
                      var t4 = e5.callback, r3 = e5.args;
                      switch (r3.length) {
                        case 0:
                          t4();
                          break;
                        case 1:
                          t4(r3[0]);
                          break;
                        case 2:
                          t4(r3[0], r3[1]);
                          break;
                        case 3:
                          t4(r3[0], r3[1], r3[2]);
                          break;
                        default:
                          t4.apply(n, r3);
                      }
                    })(t3);
                  } finally {
                    f(e4), u = false;
                  }
                }
              }
            }
            function d(e4) {
              e4.source === r2 && "string" == typeof e4.data && 0 === e4.data.indexOf(a) && c(+e4.data.slice(a.length));
            }
          })("undefined" == typeof self ? void 0 === e2 ? this : e2 : self);
        }).call(this, "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
      }, {}] }, {}, [10])(10);
    });
  })(jszip_min);
  return jszip_min.exports;
}
requireJszip_min();
const reg = /* @__PURE__ */ new Map();
const listeners = /* @__PURE__ */ new Set();
const bump = () => {
  listeners.forEach((l) => l());
};
const getImported = (id) => reg.get(id);
function db() {
  return new Promise((res) => {
    try {
      if (typeof indexedDB === "undefined") return res(null);
      const r = indexedDB.open("formwerk-imports", 1);
      r.onupgradeneeded = () => r.result.createObjectStore("meshes");
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch {
      res(null);
    }
  });
}
async function registerImported(im, persist = true) {
  reg.set(im.id, im);
  bump();
  if (!persist) return;
  const d = await db();
  if (!d) return;
  await new Promise((res) => {
    const tx = d.transaction("meshes", "readwrite");
    tx.objectStore("meshes").put({ id: im.id, name: im.name, size: im.size, pos: im.mesh.pos, tri: im.mesh.tri }, im.id);
    tx.oncomplete = () => res();
    tx.onerror = () => res();
  });
}
var flatten_1;
var hasRequiredFlatten;
function requireFlatten() {
  if (hasRequiredFlatten) return flatten_1;
  hasRequiredFlatten = 1;
  const flatten = (arr) => arr.flat(Infinity);
  flatten_1 = flatten;
  return flatten_1;
}
var clone_1$a;
var hasRequiredClone$a;
function requireClone$a() {
  if (hasRequiredClone$a) return clone_1$a;
  hasRequiredClone$a = 1;
  const clone = (geometry) => Object.assign({}, geometry);
  clone_1$a = clone;
  return clone_1$a;
}
var add_1$2;
var hasRequiredAdd$2;
function requireAdd$2() {
  if (hasRequiredAdd$2) return add_1$2;
  hasRequiredAdd$2 = 1;
  const add = (out, a, b) => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    out[4] = a[4] + b[4];
    out[5] = a[5] + b[5];
    out[6] = a[6] + b[6];
    out[7] = a[7] + b[7];
    out[8] = a[8] + b[8];
    out[9] = a[9] + b[9];
    out[10] = a[10] + b[10];
    out[11] = a[11] + b[11];
    out[12] = a[12] + b[12];
    out[13] = a[13] + b[13];
    out[14] = a[14] + b[14];
    out[15] = a[15] + b[15];
    return out;
  };
  add_1$2 = add;
  return add_1$2;
}
var create_1$c;
var hasRequiredCreate$c;
function requireCreate$c() {
  if (hasRequiredCreate$c) return create_1$c;
  hasRequiredCreate$c = 1;
  const create = () => [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ];
  create_1$c = create;
  return create_1$c;
}
var clone_1$9;
var hasRequiredClone$9;
function requireClone$9() {
  if (hasRequiredClone$9) return clone_1$9;
  hasRequiredClone$9 = 1;
  const create = requireCreate$c();
  const clone = (matrix) => {
    const out = create();
    out[0] = matrix[0];
    out[1] = matrix[1];
    out[2] = matrix[2];
    out[3] = matrix[3];
    out[4] = matrix[4];
    out[5] = matrix[5];
    out[6] = matrix[6];
    out[7] = matrix[7];
    out[8] = matrix[8];
    out[9] = matrix[9];
    out[10] = matrix[10];
    out[11] = matrix[11];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
    return out;
  };
  clone_1$9 = clone;
  return clone_1$9;
}
var copy_1$5;
var hasRequiredCopy$5;
function requireCopy$5() {
  if (hasRequiredCopy$5) return copy_1$5;
  hasRequiredCopy$5 = 1;
  const copy = (out, matrix) => {
    out[0] = matrix[0];
    out[1] = matrix[1];
    out[2] = matrix[2];
    out[3] = matrix[3];
    out[4] = matrix[4];
    out[5] = matrix[5];
    out[6] = matrix[6];
    out[7] = matrix[7];
    out[8] = matrix[8];
    out[9] = matrix[9];
    out[10] = matrix[10];
    out[11] = matrix[11];
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
    return out;
  };
  copy_1$5 = copy;
  return copy_1$5;
}
var invert_1$2;
var hasRequiredInvert$2;
function requireInvert$2() {
  if (hasRequiredInvert$2) return invert_1$2;
  hasRequiredInvert$2 = 1;
  const invert = (out, matrix) => {
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    const a30 = matrix[12];
    const a31 = matrix[13];
    const a32 = matrix[14];
    const a33 = matrix[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1 / det;
    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return out;
  };
  invert_1$2 = invert;
  return invert_1$2;
}
var equals_1$7;
var hasRequiredEquals$7;
function requireEquals$7() {
  if (hasRequiredEquals$7) return equals_1$7;
  hasRequiredEquals$7 = 1;
  const equals = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] && a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] && a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
  equals_1$7 = equals;
  return equals_1$7;
}
var constants;
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  const spatialResolution = 1e5;
  const EPS = 1e-5;
  const NEPS = 1e-13;
  const TAU = Math.PI * 2;
  constants = {
    EPS,
    NEPS,
    TAU,
    spatialResolution
  };
  return constants;
}
var trigonometry;
var hasRequiredTrigonometry;
function requireTrigonometry() {
  if (hasRequiredTrigonometry) return trigonometry;
  hasRequiredTrigonometry = 1;
  const { NEPS } = requireConstants();
  const rezero = (n) => Math.abs(n) < NEPS ? 0 : n;
  const sin = (radians) => rezero(Math.sin(radians));
  const cos = (radians) => rezero(Math.cos(radians));
  trigonometry = { sin, cos };
  return trigonometry;
}
var identity_1;
var hasRequiredIdentity;
function requireIdentity() {
  if (hasRequiredIdentity) return identity_1;
  hasRequiredIdentity = 1;
  const identity = (out) => {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  identity_1 = identity;
  return identity_1;
}
var fromRotation_1;
var hasRequiredFromRotation;
function requireFromRotation() {
  if (hasRequiredFromRotation) return fromRotation_1;
  hasRequiredFromRotation = 1;
  const { EPS } = requireConstants();
  const { sin, cos } = requireTrigonometry();
  const identity = requireIdentity();
  const fromRotation = (out, rad, axis) => {
    let [x, y, z] = axis;
    const lengthSquared = x * x + y * y + z * z;
    if (Math.abs(lengthSquared) < EPS) {
      return identity(out);
    }
    const len = 1 / Math.sqrt(lengthSquared);
    x *= len;
    y *= len;
    z *= len;
    const s = sin(rad);
    const c = cos(rad);
    const t = 1 - c;
    out[0] = x * x * t + c;
    out[1] = y * x * t + z * s;
    out[2] = z * x * t - y * s;
    out[3] = 0;
    out[4] = x * y * t - z * s;
    out[5] = y * y * t + c;
    out[6] = z * y * t + x * s;
    out[7] = 0;
    out[8] = x * z * t + y * s;
    out[9] = y * z * t - x * s;
    out[10] = z * z * t + c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  fromRotation_1 = fromRotation;
  return fromRotation_1;
}
var fromScaling_1;
var hasRequiredFromScaling;
function requireFromScaling() {
  if (hasRequiredFromScaling) return fromScaling_1;
  hasRequiredFromScaling = 1;
  const fromScaling = (out, vector) => {
    out[0] = vector[0];
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = vector[1];
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = vector[2];
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  fromScaling_1 = fromScaling;
  return fromScaling_1;
}
var fromTaitBryanRotation_1;
var hasRequiredFromTaitBryanRotation;
function requireFromTaitBryanRotation() {
  if (hasRequiredFromTaitBryanRotation) return fromTaitBryanRotation_1;
  hasRequiredFromTaitBryanRotation = 1;
  const { sin, cos } = requireTrigonometry();
  const fromTaitBryanRotation = (out, yaw, pitch, roll) => {
    const sy = sin(yaw);
    const cy = cos(yaw);
    const sp = sin(pitch);
    const cp = cos(pitch);
    const sr = sin(roll);
    const cr = cos(roll);
    out[0] = cp * cy;
    out[1] = cp * sy;
    out[2] = -sp;
    out[3] = 0;
    out[4] = sr * sp * cy - cr * sy;
    out[5] = cr * cy + sr * sp * sy;
    out[6] = sr * cp;
    out[7] = 0;
    out[8] = sr * sy + cr * sp * cy;
    out[9] = cr * sp * sy - sr * cy;
    out[10] = cr * cp;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  fromTaitBryanRotation_1 = fromTaitBryanRotation;
  return fromTaitBryanRotation_1;
}
var fromTranslation_1;
var hasRequiredFromTranslation;
function requireFromTranslation() {
  if (hasRequiredFromTranslation) return fromTranslation_1;
  hasRequiredFromTranslation = 1;
  const fromTranslation = (out, vector) => {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = vector[0];
    out[13] = vector[1];
    out[14] = vector[2];
    out[15] = 1;
    return out;
  };
  fromTranslation_1 = fromTranslation;
  return fromTranslation_1;
}
var fromValues_1$4;
var hasRequiredFromValues$4;
function requireFromValues$4() {
  if (hasRequiredFromValues$4) return fromValues_1$4;
  hasRequiredFromValues$4 = 1;
  const create = requireCreate$c();
  const fromValues = (m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) => {
    const out = create();
    out[0] = m00;
    out[1] = m01;
    out[2] = m02;
    out[3] = m03;
    out[4] = m10;
    out[5] = m11;
    out[6] = m12;
    out[7] = m13;
    out[8] = m20;
    out[9] = m21;
    out[10] = m22;
    out[11] = m23;
    out[12] = m30;
    out[13] = m31;
    out[14] = m32;
    out[15] = m33;
    return out;
  };
  fromValues_1$4 = fromValues;
  return fromValues_1$4;
}
var abs_1$1;
var hasRequiredAbs$1;
function requireAbs$1() {
  if (hasRequiredAbs$1) return abs_1$1;
  hasRequiredAbs$1 = 1;
  const abs = (out, vector) => {
    out[0] = Math.abs(vector[0]);
    out[1] = Math.abs(vector[1]);
    out[2] = Math.abs(vector[2]);
    return out;
  };
  abs_1$1 = abs;
  return abs_1$1;
}
var add_1$1;
var hasRequiredAdd$1;
function requireAdd$1() {
  if (hasRequiredAdd$1) return add_1$1;
  hasRequiredAdd$1 = 1;
  const add = (out, a, b) => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    return out;
  };
  add_1$1 = add;
  return add_1$1;
}
var dot_1$2;
var hasRequiredDot$2;
function requireDot$2() {
  if (hasRequiredDot$2) return dot_1$2;
  hasRequiredDot$2 = 1;
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  dot_1$2 = dot;
  return dot_1$2;
}
var angle_1;
var hasRequiredAngle$1;
function requireAngle$1() {
  if (hasRequiredAngle$1) return angle_1;
  hasRequiredAngle$1 = 1;
  const dot = requireDot$2();
  const angle2 = (a, b) => {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    const mag1 = Math.sqrt(ax * ax + ay * ay + az * az);
    const mag2 = Math.sqrt(bx * bx + by * by + bz * bz);
    const mag = mag1 * mag2;
    const cosine = mag && dot(a, b) / mag;
    return Math.acos(Math.min(Math.max(cosine, -1), 1));
  };
  angle_1 = angle2;
  return angle_1;
}
var create_1$b;
var hasRequiredCreate$b;
function requireCreate$b() {
  if (hasRequiredCreate$b) return create_1$b;
  hasRequiredCreate$b = 1;
  const create = () => [0, 0, 0];
  create_1$b = create;
  return create_1$b;
}
var clone_1$8;
var hasRequiredClone$8;
function requireClone$8() {
  if (hasRequiredClone$8) return clone_1$8;
  hasRequiredClone$8 = 1;
  const create = requireCreate$b();
  const clone = (vector) => {
    const out = create();
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    return out;
  };
  clone_1$8 = clone;
  return clone_1$8;
}
var copy_1$4;
var hasRequiredCopy$4;
function requireCopy$4() {
  if (hasRequiredCopy$4) return copy_1$4;
  hasRequiredCopy$4 = 1;
  const copy = (out, vector) => {
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    return out;
  };
  copy_1$4 = copy;
  return copy_1$4;
}
var cross_1$1;
var hasRequiredCross$1;
function requireCross$1() {
  if (hasRequiredCross$1) return cross_1$1;
  hasRequiredCross$1 = 1;
  const cross = (out, a, b) => {
    const ax = a[0];
    const ay = a[1];
    const az = a[2];
    const bx = b[0];
    const by = b[1];
    const bz = b[2];
    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
  };
  cross_1$1 = cross;
  return cross_1$1;
}
var distance_1$1;
var hasRequiredDistance$1;
function requireDistance$1() {
  if (hasRequiredDistance$1) return distance_1$1;
  hasRequiredDistance$1 = 1;
  const distance = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  distance_1$1 = distance;
  return distance_1$1;
}
var divide_1$1;
var hasRequiredDivide$1;
function requireDivide$1() {
  if (hasRequiredDivide$1) return divide_1$1;
  hasRequiredDivide$1 = 1;
  const divide = (out, a, b) => {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    out[2] = a[2] / b[2];
    return out;
  };
  divide_1$1 = divide;
  return divide_1$1;
}
var equals_1$6;
var hasRequiredEquals$6;
function requireEquals$6() {
  if (hasRequiredEquals$6) return equals_1$6;
  hasRequiredEquals$6 = 1;
  const equals = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  equals_1$6 = equals;
  return equals_1$6;
}
var fromScalar_1$2;
var hasRequiredFromScalar$2;
function requireFromScalar$2() {
  if (hasRequiredFromScalar$2) return fromScalar_1$2;
  hasRequiredFromScalar$2 = 1;
  const fromScalar = (out, scalar) => {
    out[0] = scalar;
    out[1] = scalar;
    out[2] = scalar;
    return out;
  };
  fromScalar_1$2 = fromScalar;
  return fromScalar_1$2;
}
var fromValues_1$3;
var hasRequiredFromValues$3;
function requireFromValues$3() {
  if (hasRequiredFromValues$3) return fromValues_1$3;
  hasRequiredFromValues$3 = 1;
  const create = requireCreate$b();
  const fromValues = (x, y, z) => {
    const out = create();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
  };
  fromValues_1$3 = fromValues;
  return fromValues_1$3;
}
var fromVec2;
var hasRequiredFromVec2;
function requireFromVec2() {
  if (hasRequiredFromVec2) return fromVec2;
  hasRequiredFromVec2 = 1;
  const fromVector2 = (out, vector, z = 0) => {
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = z;
    return out;
  };
  fromVec2 = fromVector2;
  return fromVec2;
}
var length_1$2;
var hasRequiredLength$2;
function requireLength$2() {
  if (hasRequiredLength$2) return length_1$2;
  hasRequiredLength$2 = 1;
  const length = (vector) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    return Math.sqrt(x * x + y * y + z * z);
  };
  length_1$2 = length;
  return length_1$2;
}
var lerp_1$1;
var hasRequiredLerp$1;
function requireLerp$1() {
  if (hasRequiredLerp$1) return lerp_1$1;
  hasRequiredLerp$1 = 1;
  const lerp = (out, a, b, t) => {
    out[0] = a[0] + t * (b[0] - a[0]);
    out[1] = a[1] + t * (b[1] - a[1]);
    out[2] = a[2] + t * (b[2] - a[2]);
    return out;
  };
  lerp_1$1 = lerp;
  return lerp_1$1;
}
var max_1$1;
var hasRequiredMax$1;
function requireMax$1() {
  if (hasRequiredMax$1) return max_1$1;
  hasRequiredMax$1 = 1;
  const max = (out, a, b) => {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    out[2] = Math.max(a[2], b[2]);
    return out;
  };
  max_1$1 = max;
  return max_1$1;
}
var min_1$1;
var hasRequiredMin$1;
function requireMin$1() {
  if (hasRequiredMin$1) return min_1$1;
  hasRequiredMin$1 = 1;
  const min = (out, a, b) => {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    out[2] = Math.min(a[2], b[2]);
    return out;
  };
  min_1$1 = min;
  return min_1$1;
}
var multiply_1$2;
var hasRequiredMultiply$2;
function requireMultiply$2() {
  if (hasRequiredMultiply$2) return multiply_1$2;
  hasRequiredMultiply$2 = 1;
  const multiply = (out, a, b) => {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  };
  multiply_1$2 = multiply;
  return multiply_1$2;
}
var negate_1$1;
var hasRequiredNegate$1;
function requireNegate$1() {
  if (hasRequiredNegate$1) return negate_1$1;
  hasRequiredNegate$1 = 1;
  const negate = (out, vector) => {
    out[0] = -vector[0];
    out[1] = -vector[1];
    out[2] = -vector[2];
    return out;
  };
  negate_1$1 = negate;
  return negate_1$1;
}
var normalize_1$1;
var hasRequiredNormalize$1;
function requireNormalize$1() {
  if (hasRequiredNormalize$1) return normalize_1$1;
  hasRequiredNormalize$1 = 1;
  const normalize = (out, vector) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    let len = x * x + y * y + z * z;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    return out;
  };
  normalize_1$1 = normalize;
  return normalize_1$1;
}
var orthogonal_1;
var hasRequiredOrthogonal;
function requireOrthogonal() {
  if (hasRequiredOrthogonal) return orthogonal_1;
  hasRequiredOrthogonal = 1;
  const abs = requireAbs$1();
  const create = requireCreate$b();
  const cross = requireCross$1();
  const orthogonal = (out, vector) => {
    const bV = abs(create(), vector);
    const b0 = 0 + (bV[0] < bV[1] && bV[0] < bV[2]);
    const b1 = 0 + (bV[1] <= bV[0] && bV[1] < bV[2]);
    const b2 = 0 + (bV[2] <= bV[0] && bV[2] <= bV[1]);
    return cross(out, vector, [b0, b1, b2]);
  };
  orthogonal_1 = orthogonal;
  return orthogonal_1;
}
var rotateX_1$1;
var hasRequiredRotateX$1;
function requireRotateX$1() {
  if (hasRequiredRotateX$1) return rotateX_1$1;
  hasRequiredRotateX$1 = 1;
  const rotateX = (out, vector, origin, radians) => {
    const p = [];
    const r = [];
    p[0] = vector[0] - origin[0];
    p[1] = vector[1] - origin[1];
    p[2] = vector[2] - origin[2];
    r[0] = p[0];
    r[1] = p[1] * Math.cos(radians) - p[2] * Math.sin(radians);
    r[2] = p[1] * Math.sin(radians) + p[2] * Math.cos(radians);
    out[0] = r[0] + origin[0];
    out[1] = r[1] + origin[1];
    out[2] = r[2] + origin[2];
    return out;
  };
  rotateX_1$1 = rotateX;
  return rotateX_1$1;
}
var rotateY_1$1;
var hasRequiredRotateY$1;
function requireRotateY$1() {
  if (hasRequiredRotateY$1) return rotateY_1$1;
  hasRequiredRotateY$1 = 1;
  const rotateY = (out, vector, origin, radians) => {
    const p = [];
    const r = [];
    p[0] = vector[0] - origin[0];
    p[1] = vector[1] - origin[1];
    p[2] = vector[2] - origin[2];
    r[0] = p[2] * Math.sin(radians) + p[0] * Math.cos(radians);
    r[1] = p[1];
    r[2] = p[2] * Math.cos(radians) - p[0] * Math.sin(radians);
    out[0] = r[0] + origin[0];
    out[1] = r[1] + origin[1];
    out[2] = r[2] + origin[2];
    return out;
  };
  rotateY_1$1 = rotateY;
  return rotateY_1$1;
}
var rotateZ_1$1;
var hasRequiredRotateZ$1;
function requireRotateZ$1() {
  if (hasRequiredRotateZ$1) return rotateZ_1$1;
  hasRequiredRotateZ$1 = 1;
  const rotateZ = (out, vector, origin, radians) => {
    const p = [];
    const r = [];
    p[0] = vector[0] - origin[0];
    p[1] = vector[1] - origin[1];
    r[0] = p[0] * Math.cos(radians) - p[1] * Math.sin(radians);
    r[1] = p[0] * Math.sin(radians) + p[1] * Math.cos(radians);
    out[0] = r[0] + origin[0];
    out[1] = r[1] + origin[1];
    out[2] = vector[2];
    return out;
  };
  rotateZ_1$1 = rotateZ;
  return rotateZ_1$1;
}
var scale_1$3;
var hasRequiredScale$3;
function requireScale$3() {
  if (hasRequiredScale$3) return scale_1$3;
  hasRequiredScale$3 = 1;
  const scale = (out, vector, amount) => {
    out[0] = vector[0] * amount;
    out[1] = vector[1] * amount;
    out[2] = vector[2] * amount;
    return out;
  };
  scale_1$3 = scale;
  return scale_1$3;
}
var snap_1$2;
var hasRequiredSnap$2;
function requireSnap$2() {
  if (hasRequiredSnap$2) return snap_1$2;
  hasRequiredSnap$2 = 1;
  const snap = (out, vector, epsilon) => {
    out[0] = Math.round(vector[0] / epsilon) * epsilon + 0;
    out[1] = Math.round(vector[1] / epsilon) * epsilon + 0;
    out[2] = Math.round(vector[2] / epsilon) * epsilon + 0;
    return out;
  };
  snap_1$2 = snap;
  return snap_1$2;
}
var squaredDistance_1$1;
var hasRequiredSquaredDistance$1;
function requireSquaredDistance$1() {
  if (hasRequiredSquaredDistance$1) return squaredDistance_1$1;
  hasRequiredSquaredDistance$1 = 1;
  const squaredDistance = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    const z = b[2] - a[2];
    return x * x + y * y + z * z;
  };
  squaredDistance_1$1 = squaredDistance;
  return squaredDistance_1$1;
}
var squaredLength_1$1;
var hasRequiredSquaredLength$1;
function requireSquaredLength$1() {
  if (hasRequiredSquaredLength$1) return squaredLength_1$1;
  hasRequiredSquaredLength$1 = 1;
  const squaredLength = (vector) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    return x * x + y * y + z * z;
  };
  squaredLength_1$1 = squaredLength;
  return squaredLength_1$1;
}
var subtract_1$3;
var hasRequiredSubtract$3;
function requireSubtract$3() {
  if (hasRequiredSubtract$3) return subtract_1$3;
  hasRequiredSubtract$3 = 1;
  const subtract = (out, a, b) => {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    return out;
  };
  subtract_1$3 = subtract;
  return subtract_1$3;
}
var toString_1$a;
var hasRequiredToString$a;
function requireToString$a() {
  if (hasRequiredToString$a) return toString_1$a;
  hasRequiredToString$a = 1;
  const toString = (vec) => `[${vec[0].toFixed(7)}, ${vec[1].toFixed(7)}, ${vec[2].toFixed(7)}]`;
  toString_1$a = toString;
  return toString_1$a;
}
var transform_1$b;
var hasRequiredTransform$b;
function requireTransform$b() {
  if (hasRequiredTransform$b) return transform_1$b;
  hasRequiredTransform$b = 1;
  const transform = (out, vector, matrix) => {
    const x = vector[0];
    const y = vector[1];
    const z = vector[2];
    let w = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
    w = w || 1;
    out[0] = (matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12]) / w;
    out[1] = (matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13]) / w;
    out[2] = (matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14]) / w;
    return out;
  };
  transform_1$b = transform;
  return transform_1$b;
}
var vec3;
var hasRequiredVec3;
function requireVec3() {
  if (hasRequiredVec3) return vec3;
  hasRequiredVec3 = 1;
  vec3 = {
    abs: requireAbs$1(),
    add: requireAdd$1(),
    angle: requireAngle$1(),
    clone: requireClone$8(),
    copy: requireCopy$4(),
    create: requireCreate$b(),
    cross: requireCross$1(),
    distance: requireDistance$1(),
    divide: requireDivide$1(),
    dot: requireDot$2(),
    equals: requireEquals$6(),
    fromScalar: requireFromScalar$2(),
    fromValues: requireFromValues$3(),
    fromVec2: requireFromVec2(),
    length: requireLength$2(),
    lerp: requireLerp$1(),
    max: requireMax$1(),
    min: requireMin$1(),
    multiply: requireMultiply$2(),
    negate: requireNegate$1(),
    normalize: requireNormalize$1(),
    orthogonal: requireOrthogonal(),
    rotateX: requireRotateX$1(),
    rotateY: requireRotateY$1(),
    rotateZ: requireRotateZ$1(),
    scale: requireScale$3(),
    snap: requireSnap$2(),
    squaredDistance: requireSquaredDistance$1(),
    squaredLength: requireSquaredLength$1(),
    subtract: requireSubtract$3(),
    toString: requireToString$a(),
    transform: requireTransform$b()
  };
  return vec3;
}
var fromVectorRotation_1;
var hasRequiredFromVectorRotation;
function requireFromVectorRotation() {
  if (hasRequiredFromVectorRotation) return fromVectorRotation_1;
  hasRequiredFromVectorRotation = 1;
  const vec32 = requireVec3();
  const fromRotation = requireFromRotation();
  const fromVectorRotation = (out, source, target) => {
    const sourceNormal = vec32.normalize(vec32.create(), source);
    const targetNormal = vec32.normalize(vec32.create(), target);
    const axis = vec32.cross(vec32.create(), targetNormal, sourceNormal);
    const cosA = vec32.dot(targetNormal, sourceNormal);
    if (cosA === -1) return fromRotation(out, Math.PI, vec32.orthogonal(axis, sourceNormal));
    const k = 1 / (1 + cosA);
    out[0] = axis[0] * axis[0] * k + cosA;
    out[1] = axis[1] * axis[0] * k - axis[2];
    out[2] = axis[2] * axis[0] * k + axis[1];
    out[3] = 0;
    out[4] = axis[0] * axis[1] * k + axis[2];
    out[5] = axis[1] * axis[1] * k + cosA;
    out[6] = axis[2] * axis[1] * k - axis[0];
    out[7] = 0;
    out[8] = axis[0] * axis[2] * k - axis[1];
    out[9] = axis[1] * axis[2] * k + axis[0];
    out[10] = axis[2] * axis[2] * k + cosA;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  fromVectorRotation_1 = fromVectorRotation;
  return fromVectorRotation_1;
}
var fromXRotation_1;
var hasRequiredFromXRotation;
function requireFromXRotation() {
  if (hasRequiredFromXRotation) return fromXRotation_1;
  hasRequiredFromXRotation = 1;
  const { sin, cos } = requireTrigonometry();
  const fromXRotation = (out, radians) => {
    const s = sin(radians);
    const c = cos(radians);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = c;
    out[6] = s;
    out[7] = 0;
    out[8] = 0;
    out[9] = -s;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  fromXRotation_1 = fromXRotation;
  return fromXRotation_1;
}
var fromYRotation_1;
var hasRequiredFromYRotation;
function requireFromYRotation() {
  if (hasRequiredFromYRotation) return fromYRotation_1;
  hasRequiredFromYRotation = 1;
  const { sin, cos } = requireTrigonometry();
  const fromYRotation = (out, radians) => {
    const s = sin(radians);
    const c = cos(radians);
    out[0] = c;
    out[1] = 0;
    out[2] = -s;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = s;
    out[9] = 0;
    out[10] = c;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  fromYRotation_1 = fromYRotation;
  return fromYRotation_1;
}
var fromZRotation_1;
var hasRequiredFromZRotation;
function requireFromZRotation() {
  if (hasRequiredFromZRotation) return fromZRotation_1;
  hasRequiredFromZRotation = 1;
  const { sin, cos } = requireTrigonometry();
  const fromZRotation = (out, radians) => {
    const s = sin(radians);
    const c = cos(radians);
    out[0] = c;
    out[1] = s;
    out[2] = 0;
    out[3] = 0;
    out[4] = -s;
    out[5] = c;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
  };
  fromZRotation_1 = fromZRotation;
  return fromZRotation_1;
}
var isIdentity_1;
var hasRequiredIsIdentity;
function requireIsIdentity() {
  if (hasRequiredIsIdentity) return isIdentity_1;
  hasRequiredIsIdentity = 1;
  const isIdentity = (matrix) => matrix[0] === 1 && matrix[1] === 0 && matrix[2] === 0 && matrix[3] === 0 && matrix[4] === 0 && matrix[5] === 1 && matrix[6] === 0 && matrix[7] === 0 && matrix[8] === 0 && matrix[9] === 0 && matrix[10] === 1 && matrix[11] === 0 && matrix[12] === 0 && matrix[13] === 0 && matrix[14] === 0 && matrix[15] === 1;
  isIdentity_1 = isIdentity;
  return isIdentity_1;
}
var isOnlyTransformScale_1;
var hasRequiredIsOnlyTransformScale;
function requireIsOnlyTransformScale() {
  if (hasRequiredIsOnlyTransformScale) return isOnlyTransformScale_1;
  hasRequiredIsOnlyTransformScale = 1;
  const isOnlyTransformScale = (matrix) => (
    // TODO check if it is worth the effort to add recognition of 90 deg rotations
    isZero(matrix[1]) && isZero(matrix[2]) && isZero(matrix[3]) && isZero(matrix[4]) && isZero(matrix[6]) && isZero(matrix[7]) && isZero(matrix[8]) && isZero(matrix[9]) && isZero(matrix[11]) && matrix[15] === 1
  );
  const isZero = (num2) => Math.abs(num2) < Number.EPSILON;
  isOnlyTransformScale_1 = isOnlyTransformScale;
  return isOnlyTransformScale_1;
}
var isMirroring_1;
var hasRequiredIsMirroring;
function requireIsMirroring() {
  if (hasRequiredIsMirroring) return isMirroring_1;
  hasRequiredIsMirroring = 1;
  const isMirroring = (matrix) => {
    const x = matrix[4] * matrix[9] - matrix[8] * matrix[5];
    const y = matrix[8] * matrix[1] - matrix[0] * matrix[9];
    const z = matrix[0] * matrix[5] - matrix[4] * matrix[1];
    const d = x * matrix[2] + y * matrix[6] + z * matrix[10];
    return d < 0;
  };
  isMirroring_1 = isMirroring;
  return isMirroring_1;
}
var mirrorByPlane_1;
var hasRequiredMirrorByPlane;
function requireMirrorByPlane() {
  if (hasRequiredMirrorByPlane) return mirrorByPlane_1;
  hasRequiredMirrorByPlane = 1;
  const mirrorByPlane = (out, plane2) => {
    const [nx, ny, nz, w] = plane2;
    out[0] = 1 - 2 * nx * nx;
    out[1] = -2 * ny * nx;
    out[2] = -2 * nz * nx;
    out[3] = 0;
    out[4] = -2 * nx * ny;
    out[5] = 1 - 2 * ny * ny;
    out[6] = -2 * nz * ny;
    out[7] = 0;
    out[8] = -2 * nx * nz;
    out[9] = -2 * ny * nz;
    out[10] = 1 - 2 * nz * nz;
    out[11] = 0;
    out[12] = 2 * nx * w;
    out[13] = 2 * ny * w;
    out[14] = 2 * nz * w;
    out[15] = 1;
    return out;
  };
  mirrorByPlane_1 = mirrorByPlane;
  return mirrorByPlane_1;
}
var multiply_1$1;
var hasRequiredMultiply$1;
function requireMultiply$1() {
  if (hasRequiredMultiply$1) return multiply_1$1;
  hasRequiredMultiply$1 = 1;
  const multiply = (out, a, b) => {
    const a00 = a[0];
    const a01 = a[1];
    const a02 = a[2];
    const a03 = a[3];
    const a10 = a[4];
    const a11 = a[5];
    const a12 = a[6];
    const a13 = a[7];
    const a20 = a[8];
    const a21 = a[9];
    const a22 = a[10];
    const a23 = a[11];
    const a30 = a[12];
    const a31 = a[13];
    const a32 = a[14];
    const a33 = a[15];
    let b0 = b[0];
    let b1 = b[1];
    let b2 = b[2];
    let b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  };
  multiply_1$1 = multiply;
  return multiply_1$1;
}
var rotate_1$2;
var hasRequiredRotate$2;
function requireRotate$2() {
  if (hasRequiredRotate$2) return rotate_1$2;
  hasRequiredRotate$2 = 1;
  const { EPS } = requireConstants();
  const { sin, cos } = requireTrigonometry();
  const copy = requireCopy$5();
  const rotate = (out, matrix, radians, axis) => {
    let [x, y, z] = axis;
    const lengthSquared = x * x + y * y + z * z;
    if (Math.abs(lengthSquared) < EPS) {
      return copy(out, matrix);
    }
    const len = 1 / Math.sqrt(lengthSquared);
    x *= len;
    y *= len;
    z *= len;
    const s = sin(radians);
    const c = cos(radians);
    const t = 1 - c;
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (matrix !== out) {
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    return out;
  };
  rotate_1$2 = rotate;
  return rotate_1$2;
}
var rotateX_1;
var hasRequiredRotateX;
function requireRotateX() {
  if (hasRequiredRotateX) return rotateX_1;
  hasRequiredRotateX = 1;
  const { sin, cos } = requireTrigonometry();
  const rotateX = (out, matrix, radians) => {
    const s = sin(radians);
    const c = cos(radians);
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    if (matrix !== out) {
      out[0] = matrix[0];
      out[1] = matrix[1];
      out[2] = matrix[2];
      out[3] = matrix[3];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
  };
  rotateX_1 = rotateX;
  return rotateX_1;
}
var rotateY_1;
var hasRequiredRotateY;
function requireRotateY() {
  if (hasRequiredRotateY) return rotateY_1;
  hasRequiredRotateY = 1;
  const { sin, cos } = requireTrigonometry();
  const rotateY = (out, matrix, radians) => {
    const s = sin(radians);
    const c = cos(radians);
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a20 = matrix[8];
    const a21 = matrix[9];
    const a22 = matrix[10];
    const a23 = matrix[11];
    if (matrix !== out) {
      out[4] = matrix[4];
      out[5] = matrix[5];
      out[6] = matrix[6];
      out[7] = matrix[7];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
  };
  rotateY_1 = rotateY;
  return rotateY_1;
}
var rotateZ_1;
var hasRequiredRotateZ;
function requireRotateZ() {
  if (hasRequiredRotateZ) return rotateZ_1;
  hasRequiredRotateZ = 1;
  const { sin, cos } = requireTrigonometry();
  const rotateZ = (out, matrix, radians) => {
    const s = sin(radians);
    const c = cos(radians);
    const a00 = matrix[0];
    const a01 = matrix[1];
    const a02 = matrix[2];
    const a03 = matrix[3];
    const a10 = matrix[4];
    const a11 = matrix[5];
    const a12 = matrix[6];
    const a13 = matrix[7];
    if (matrix !== out) {
      out[8] = matrix[8];
      out[9] = matrix[9];
      out[10] = matrix[10];
      out[11] = matrix[11];
      out[12] = matrix[12];
      out[13] = matrix[13];
      out[14] = matrix[14];
      out[15] = matrix[15];
    }
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
  };
  rotateZ_1 = rotateZ;
  return rotateZ_1;
}
var scale_1$2;
var hasRequiredScale$2;
function requireScale$2() {
  if (hasRequiredScale$2) return scale_1$2;
  hasRequiredScale$2 = 1;
  const scale = (out, matrix, dimensions) => {
    const x = dimensions[0];
    const y = dimensions[1];
    const z = dimensions[2];
    out[0] = matrix[0] * x;
    out[1] = matrix[1] * x;
    out[2] = matrix[2] * x;
    out[3] = matrix[3] * x;
    out[4] = matrix[4] * y;
    out[5] = matrix[5] * y;
    out[6] = matrix[6] * y;
    out[7] = matrix[7] * y;
    out[8] = matrix[8] * z;
    out[9] = matrix[9] * z;
    out[10] = matrix[10] * z;
    out[11] = matrix[11] * z;
    out[12] = matrix[12];
    out[13] = matrix[13];
    out[14] = matrix[14];
    out[15] = matrix[15];
    return out;
  };
  scale_1$2 = scale;
  return scale_1$2;
}
var subtract_1$2;
var hasRequiredSubtract$2;
function requireSubtract$2() {
  if (hasRequiredSubtract$2) return subtract_1$2;
  hasRequiredSubtract$2 = 1;
  const subtract = (out, a, b) => {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    out[4] = a[4] - b[4];
    out[5] = a[5] - b[5];
    out[6] = a[6] - b[6];
    out[7] = a[7] - b[7];
    out[8] = a[8] - b[8];
    out[9] = a[9] - b[9];
    out[10] = a[10] - b[10];
    out[11] = a[11] - b[11];
    out[12] = a[12] - b[12];
    out[13] = a[13] - b[13];
    out[14] = a[14] - b[14];
    out[15] = a[15] - b[15];
    return out;
  };
  subtract_1$2 = subtract;
  return subtract_1$2;
}
var toString_1$9;
var hasRequiredToString$9;
function requireToString$9() {
  if (hasRequiredToString$9) return toString_1$9;
  hasRequiredToString$9 = 1;
  const toString = (mat) => mat.map((n) => n.toFixed(7)).toString();
  toString_1$9 = toString;
  return toString_1$9;
}
var translate_1$1;
var hasRequiredTranslate$1;
function requireTranslate$1() {
  if (hasRequiredTranslate$1) return translate_1$1;
  hasRequiredTranslate$1 = 1;
  const translate = (out, matrix, offsets) => {
    const x = offsets[0];
    const y = offsets[1];
    const z = offsets[2];
    let a00;
    let a01;
    let a02;
    let a03;
    let a10;
    let a11;
    let a12;
    let a13;
    let a20;
    let a21;
    let a22;
    let a23;
    if (matrix === out) {
      out[12] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12];
      out[13] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13];
      out[14] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14];
      out[15] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15];
    } else {
      a00 = matrix[0];
      a01 = matrix[1];
      a02 = matrix[2];
      a03 = matrix[3];
      a10 = matrix[4];
      a11 = matrix[5];
      a12 = matrix[6];
      a13 = matrix[7];
      a20 = matrix[8];
      a21 = matrix[9];
      a22 = matrix[10];
      a23 = matrix[11];
      out[0] = a00;
      out[1] = a01;
      out[2] = a02;
      out[3] = a03;
      out[4] = a10;
      out[5] = a11;
      out[6] = a12;
      out[7] = a13;
      out[8] = a20;
      out[9] = a21;
      out[10] = a22;
      out[11] = a23;
      out[12] = a00 * x + a10 * y + a20 * z + matrix[12];
      out[13] = a01 * x + a11 * y + a21 * z + matrix[13];
      out[14] = a02 * x + a12 * y + a22 * z + matrix[14];
      out[15] = a03 * x + a13 * y + a23 * z + matrix[15];
    }
    return out;
  };
  translate_1$1 = translate;
  return translate_1$1;
}
var mat4;
var hasRequiredMat4;
function requireMat4() {
  if (hasRequiredMat4) return mat4;
  hasRequiredMat4 = 1;
  mat4 = {
    add: requireAdd$2(),
    clone: requireClone$9(),
    copy: requireCopy$5(),
    create: requireCreate$c(),
    invert: requireInvert$2(),
    equals: requireEquals$7(),
    fromRotation: requireFromRotation(),
    fromScaling: requireFromScaling(),
    fromTaitBryanRotation: requireFromTaitBryanRotation(),
    fromTranslation: requireFromTranslation(),
    fromValues: requireFromValues$4(),
    fromVectorRotation: requireFromVectorRotation(),
    fromXRotation: requireFromXRotation(),
    fromYRotation: requireFromYRotation(),
    fromZRotation: requireFromZRotation(),
    identity: requireIdentity(),
    isIdentity: requireIsIdentity(),
    isOnlyTransformScale: requireIsOnlyTransformScale(),
    isMirroring: requireIsMirroring(),
    mirrorByPlane: requireMirrorByPlane(),
    multiply: requireMultiply$1(),
    rotate: requireRotate$2(),
    rotateX: requireRotateX(),
    rotateY: requireRotateY(),
    rotateZ: requireRotateZ(),
    scale: requireScale$2(),
    subtract: requireSubtract$2(),
    toString: requireToString$9(),
    translate: requireTranslate$1()
  };
  return mat4;
}
var create_1$a;
var hasRequiredCreate$a;
function requireCreate$a() {
  if (hasRequiredCreate$a) return create_1$a;
  hasRequiredCreate$a = 1;
  const mat42 = requireMat4();
  const create = (sides) => {
    if (sides === void 0) {
      sides = [];
    }
    return {
      sides,
      transforms: mat42.create()
    };
  };
  create_1$a = create;
  return create_1$a;
}
var abs_1;
var hasRequiredAbs;
function requireAbs() {
  if (hasRequiredAbs) return abs_1;
  hasRequiredAbs = 1;
  const abs = (out, vector) => {
    out[0] = Math.abs(vector[0]);
    out[1] = Math.abs(vector[1]);
    return out;
  };
  abs_1 = abs;
  return abs_1;
}
var add_1;
var hasRequiredAdd;
function requireAdd() {
  if (hasRequiredAdd) return add_1;
  hasRequiredAdd = 1;
  const add = (out, a, b) => {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    return out;
  };
  add_1 = add;
  return add_1;
}
var angleRadians_1;
var hasRequiredAngleRadians;
function requireAngleRadians() {
  if (hasRequiredAngleRadians) return angleRadians_1;
  hasRequiredAngleRadians = 1;
  const angleRadians = (vector) => Math.atan2(vector[1], vector[0]);
  angleRadians_1 = angleRadians;
  return angleRadians_1;
}
var angle;
var hasRequiredAngle;
function requireAngle() {
  if (hasRequiredAngle) return angle;
  hasRequiredAngle = 1;
  angle = requireAngleRadians();
  return angle;
}
var angleDegrees_1;
var hasRequiredAngleDegrees;
function requireAngleDegrees() {
  if (hasRequiredAngleDegrees) return angleDegrees_1;
  hasRequiredAngleDegrees = 1;
  const angleRadians = requireAngleRadians();
  const angleDegrees = (vector) => angleRadians(vector) * 57.29577951308232;
  angleDegrees_1 = angleDegrees;
  return angleDegrees_1;
}
var create_1$9;
var hasRequiredCreate$9;
function requireCreate$9() {
  if (hasRequiredCreate$9) return create_1$9;
  hasRequiredCreate$9 = 1;
  const create = () => [0, 0];
  create_1$9 = create;
  return create_1$9;
}
var clone_1$7;
var hasRequiredClone$7;
function requireClone$7() {
  if (hasRequiredClone$7) return clone_1$7;
  hasRequiredClone$7 = 1;
  const create = requireCreate$9();
  const clone = (vector) => {
    const out = create();
    out[0] = vector[0];
    out[1] = vector[1];
    return out;
  };
  clone_1$7 = clone;
  return clone_1$7;
}
var copy_1$3;
var hasRequiredCopy$3;
function requireCopy$3() {
  if (hasRequiredCopy$3) return copy_1$3;
  hasRequiredCopy$3 = 1;
  const copy = (out, vector) => {
    out[0] = vector[0];
    out[1] = vector[1];
    return out;
  };
  copy_1$3 = copy;
  return copy_1$3;
}
var cross_1;
var hasRequiredCross;
function requireCross() {
  if (hasRequiredCross) return cross_1;
  hasRequiredCross = 1;
  const cross = (out, a, b) => {
    out[0] = 0;
    out[1] = 0;
    out[2] = a[0] * b[1] - a[1] * b[0];
    return out;
  };
  cross_1 = cross;
  return cross_1;
}
var distance_1;
var hasRequiredDistance;
function requireDistance() {
  if (hasRequiredDistance) return distance_1;
  hasRequiredDistance = 1;
  const distance = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    return Math.sqrt(x * x + y * y);
  };
  distance_1 = distance;
  return distance_1;
}
var divide_1;
var hasRequiredDivide;
function requireDivide() {
  if (hasRequiredDivide) return divide_1;
  hasRequiredDivide = 1;
  const divide = (out, a, b) => {
    out[0] = a[0] / b[0];
    out[1] = a[1] / b[1];
    return out;
  };
  divide_1 = divide;
  return divide_1;
}
var dot_1$1;
var hasRequiredDot$1;
function requireDot$1() {
  if (hasRequiredDot$1) return dot_1$1;
  hasRequiredDot$1 = 1;
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  dot_1$1 = dot;
  return dot_1$1;
}
var equals_1$5;
var hasRequiredEquals$5;
function requireEquals$5() {
  if (hasRequiredEquals$5) return equals_1$5;
  hasRequiredEquals$5 = 1;
  const equals = (a, b) => a[0] === b[0] && a[1] === b[1];
  equals_1$5 = equals;
  return equals_1$5;
}
var fromAngleRadians_1;
var hasRequiredFromAngleRadians;
function requireFromAngleRadians() {
  if (hasRequiredFromAngleRadians) return fromAngleRadians_1;
  hasRequiredFromAngleRadians = 1;
  const { sin, cos } = requireTrigonometry();
  const fromAngleRadians = (out, radians) => {
    out[0] = cos(radians);
    out[1] = sin(radians);
    return out;
  };
  fromAngleRadians_1 = fromAngleRadians;
  return fromAngleRadians_1;
}
var fromAngleDegrees_1;
var hasRequiredFromAngleDegrees;
function requireFromAngleDegrees() {
  if (hasRequiredFromAngleDegrees) return fromAngleDegrees_1;
  hasRequiredFromAngleDegrees = 1;
  const fromAngleRadians = requireFromAngleRadians();
  const fromAngleDegrees = (out, degrees) => fromAngleRadians(out, degrees * 0.017453292519943295);
  fromAngleDegrees_1 = fromAngleDegrees;
  return fromAngleDegrees_1;
}
var fromScalar_1$1;
var hasRequiredFromScalar$1;
function requireFromScalar$1() {
  if (hasRequiredFromScalar$1) return fromScalar_1$1;
  hasRequiredFromScalar$1 = 1;
  const fromScalar = (out, scalar) => {
    out[0] = scalar;
    out[1] = scalar;
    return out;
  };
  fromScalar_1$1 = fromScalar;
  return fromScalar_1$1;
}
var fromValues_1$2;
var hasRequiredFromValues$2;
function requireFromValues$2() {
  if (hasRequiredFromValues$2) return fromValues_1$2;
  hasRequiredFromValues$2 = 1;
  const create = requireCreate$9();
  const fromValues = (x, y) => {
    const out = create();
    out[0] = x;
    out[1] = y;
    return out;
  };
  fromValues_1$2 = fromValues;
  return fromValues_1$2;
}
var length_1$1;
var hasRequiredLength$1;
function requireLength$1() {
  if (hasRequiredLength$1) return length_1$1;
  hasRequiredLength$1 = 1;
  const length = (vector) => Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
  length_1$1 = length;
  return length_1$1;
}
var lerp_1;
var hasRequiredLerp;
function requireLerp() {
  if (hasRequiredLerp) return lerp_1;
  hasRequiredLerp = 1;
  const lerp = (out, a, b, t) => {
    const ax = a[0];
    const ay = a[1];
    out[0] = ax + t * (b[0] - ax);
    out[1] = ay + t * (b[1] - ay);
    return out;
  };
  lerp_1 = lerp;
  return lerp_1;
}
var max_1;
var hasRequiredMax;
function requireMax() {
  if (hasRequiredMax) return max_1;
  hasRequiredMax = 1;
  const max = (out, a, b) => {
    out[0] = Math.max(a[0], b[0]);
    out[1] = Math.max(a[1], b[1]);
    return out;
  };
  max_1 = max;
  return max_1;
}
var min_1;
var hasRequiredMin;
function requireMin() {
  if (hasRequiredMin) return min_1;
  hasRequiredMin = 1;
  const min = (out, a, b) => {
    out[0] = Math.min(a[0], b[0]);
    out[1] = Math.min(a[1], b[1]);
    return out;
  };
  min_1 = min;
  return min_1;
}
var multiply_1;
var hasRequiredMultiply;
function requireMultiply() {
  if (hasRequiredMultiply) return multiply_1;
  hasRequiredMultiply = 1;
  const multiply = (out, a, b) => {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    return out;
  };
  multiply_1 = multiply;
  return multiply_1;
}
var negate_1;
var hasRequiredNegate;
function requireNegate() {
  if (hasRequiredNegate) return negate_1;
  hasRequiredNegate = 1;
  const negate = (out, vector) => {
    out[0] = -vector[0];
    out[1] = -vector[1];
    return out;
  };
  negate_1 = negate;
  return negate_1;
}
var rotate_1$1;
var hasRequiredRotate$1;
function requireRotate$1() {
  if (hasRequiredRotate$1) return rotate_1$1;
  hasRequiredRotate$1 = 1;
  const rotate = (out, vector, origin, radians) => {
    const x = vector[0] - origin[0];
    const y = vector[1] - origin[1];
    const c = Math.cos(radians);
    const s = Math.sin(radians);
    out[0] = x * c - y * s + origin[0];
    out[1] = x * s + y * c + origin[1];
    return out;
  };
  rotate_1$1 = rotate;
  return rotate_1$1;
}
var normal_1;
var hasRequiredNormal;
function requireNormal() {
  if (hasRequiredNormal) return normal_1;
  hasRequiredNormal = 1;
  const { TAU } = requireConstants();
  const create = requireCreate$9();
  const rotate = requireRotate$1();
  const normal = (out, vector) => rotate(out, vector, create(), TAU / 4);
  normal_1 = normal;
  return normal_1;
}
var normalize_1;
var hasRequiredNormalize;
function requireNormalize() {
  if (hasRequiredNormalize) return normalize_1;
  hasRequiredNormalize = 1;
  const normalize = (out, vector) => {
    const x = vector[0];
    const y = vector[1];
    let len = x * x + y * y;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    out[0] = x * len;
    out[1] = y * len;
    return out;
  };
  normalize_1 = normalize;
  return normalize_1;
}
var scale_1$1;
var hasRequiredScale$1;
function requireScale$1() {
  if (hasRequiredScale$1) return scale_1$1;
  hasRequiredScale$1 = 1;
  const scale = (out, vector, amount) => {
    out[0] = vector[0] * amount;
    out[1] = vector[1] * amount;
    return out;
  };
  scale_1$1 = scale;
  return scale_1$1;
}
var snap_1$1;
var hasRequiredSnap$1;
function requireSnap$1() {
  if (hasRequiredSnap$1) return snap_1$1;
  hasRequiredSnap$1 = 1;
  const snap = (out, vector, epsilon) => {
    out[0] = Math.round(vector[0] / epsilon) * epsilon + 0;
    out[1] = Math.round(vector[1] / epsilon) * epsilon + 0;
    return out;
  };
  snap_1$1 = snap;
  return snap_1$1;
}
var squaredDistance_1;
var hasRequiredSquaredDistance;
function requireSquaredDistance() {
  if (hasRequiredSquaredDistance) return squaredDistance_1;
  hasRequiredSquaredDistance = 1;
  const squaredDistance = (a, b) => {
    const x = b[0] - a[0];
    const y = b[1] - a[1];
    return x * x + y * y;
  };
  squaredDistance_1 = squaredDistance;
  return squaredDistance_1;
}
var squaredLength_1;
var hasRequiredSquaredLength;
function requireSquaredLength() {
  if (hasRequiredSquaredLength) return squaredLength_1;
  hasRequiredSquaredLength = 1;
  const squaredLength = (vector) => {
    const x = vector[0];
    const y = vector[1];
    return x * x + y * y;
  };
  squaredLength_1 = squaredLength;
  return squaredLength_1;
}
var subtract_1$1;
var hasRequiredSubtract$1;
function requireSubtract$1() {
  if (hasRequiredSubtract$1) return subtract_1$1;
  hasRequiredSubtract$1 = 1;
  const subtract = (out, a, b) => {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    return out;
  };
  subtract_1$1 = subtract;
  return subtract_1$1;
}
var toString_1$8;
var hasRequiredToString$8;
function requireToString$8() {
  if (hasRequiredToString$8) return toString_1$8;
  hasRequiredToString$8 = 1;
  const toString = (vector) => `[${vector[0].toFixed(7)}, ${vector[1].toFixed(7)}]`;
  toString_1$8 = toString;
  return toString_1$8;
}
var transform_1$a;
var hasRequiredTransform$a;
function requireTransform$a() {
  if (hasRequiredTransform$a) return transform_1$a;
  hasRequiredTransform$a = 1;
  const transform = (out, vector, matrix) => {
    const x = vector[0];
    const y = vector[1];
    out[0] = matrix[0] * x + matrix[4] * y + matrix[12];
    out[1] = matrix[1] * x + matrix[5] * y + matrix[13];
    return out;
  };
  transform_1$a = transform;
  return transform_1$a;
}
var vec2;
var hasRequiredVec2;
function requireVec2() {
  if (hasRequiredVec2) return vec2;
  hasRequiredVec2 = 1;
  vec2 = {
    abs: requireAbs(),
    add: requireAdd(),
    angle: requireAngle(),
    angleDegrees: requireAngleDegrees(),
    angleRadians: requireAngleRadians(),
    clone: requireClone$7(),
    copy: requireCopy$3(),
    create: requireCreate$9(),
    cross: requireCross(),
    distance: requireDistance(),
    divide: requireDivide(),
    dot: requireDot$1(),
    equals: requireEquals$5(),
    fromAngleDegrees: requireFromAngleDegrees(),
    fromAngleRadians: requireFromAngleRadians(),
    fromScalar: requireFromScalar$1(),
    fromValues: requireFromValues$2(),
    length: requireLength$1(),
    lerp: requireLerp(),
    max: requireMax(),
    min: requireMin(),
    multiply: requireMultiply(),
    negate: requireNegate(),
    normal: requireNormal(),
    normalize: requireNormalize(),
    rotate: requireRotate$1(),
    scale: requireScale$1(),
    snap: requireSnap$1(),
    squaredDistance: requireSquaredDistance(),
    squaredLength: requireSquaredLength(),
    subtract: requireSubtract$1(),
    toString: requireToString$8(),
    transform: requireTransform$a()
  };
  return vec2;
}
var fromPoints_1$7;
var hasRequiredFromPoints$7;
function requireFromPoints$7() {
  if (hasRequiredFromPoints$7) return fromPoints_1$7;
  hasRequiredFromPoints$7 = 1;
  const vec22 = requireVec2();
  const create = requireCreate$a();
  const fromPoints = (points) => {
    if (!Array.isArray(points)) {
      throw new Error("the given points must be an array");
    }
    let length = points.length;
    if (length < 3) {
      throw new Error("the given points must define a closed geometry with three or more points");
    }
    if (vec22.equals(points[0], points[length - 1])) --length;
    const sides = [];
    let prevpoint = points[length - 1];
    for (let i = 0; i < length; i++) {
      const point = points[i];
      sides.push([vec22.clone(prevpoint), vec22.clone(point)]);
      prevpoint = point;
    }
    return create(sides);
  };
  fromPoints_1$7 = fromPoints;
  return fromPoints_1$7;
}
var fromCompactBinary_1$2;
var hasRequiredFromCompactBinary$2;
function requireFromCompactBinary$2() {
  if (hasRequiredFromCompactBinary$2) return fromCompactBinary_1$2;
  hasRequiredFromCompactBinary$2 = 1;
  const mat42 = requireMat4();
  const vec22 = requireVec2();
  const create = requireCreate$a();
  const fromCompactBinary = (data) => {
    if (data[0] !== 0) throw new Error("invalid compact binary data");
    const created = create();
    created.transforms = mat42.clone(data.slice(1, 17));
    for (let i = 21; i < data.length; i += 4) {
      const point0 = vec22.fromValues(data[i + 0], data[i + 1]);
      const point1 = vec22.fromValues(data[i + 2], data[i + 3]);
      created.sides.push([point0, point1]);
    }
    if (data[17] >= 0) {
      created.color = [data[17], data[18], data[19], data[20]];
    }
    return created;
  };
  fromCompactBinary_1$2 = fromCompactBinary;
  return fromCompactBinary_1$2;
}
var isA_1$4;
var hasRequiredIsA$4;
function requireIsA$4() {
  if (hasRequiredIsA$4) return isA_1$4;
  hasRequiredIsA$4 = 1;
  const isA = (object) => {
    if (object && typeof object === "object") {
      if ("sides" in object && "transforms" in object) {
        if (Array.isArray(object.sides) && "length" in object.transforms) {
          return true;
        }
      }
    }
    return false;
  };
  isA_1$4 = isA;
  return isA_1$4;
}
var applyTransforms_1$2;
var hasRequiredApplyTransforms$2;
function requireApplyTransforms$2() {
  if (hasRequiredApplyTransforms$2) return applyTransforms_1$2;
  hasRequiredApplyTransforms$2 = 1;
  const mat42 = requireMat4();
  const vec22 = requireVec2();
  const applyTransforms = (geometry) => {
    if (mat42.isIdentity(geometry.transforms)) return geometry;
    geometry.sides = geometry.sides.map((side) => {
      const p0 = vec22.transform(vec22.create(), side[0], geometry.transforms);
      const p1 = vec22.transform(vec22.create(), side[1], geometry.transforms);
      return [p0, p1];
    });
    geometry.transforms = mat42.create();
    return geometry;
  };
  applyTransforms_1$2 = applyTransforms;
  return applyTransforms_1$2;
}
var toSides_1;
var hasRequiredToSides;
function requireToSides() {
  if (hasRequiredToSides) return toSides_1;
  hasRequiredToSides = 1;
  const applyTransforms = requireApplyTransforms$2();
  const toSides = (geometry) => applyTransforms(geometry).sides;
  toSides_1 = toSides;
  return toSides_1;
}
var reverse_1$4;
var hasRequiredReverse$4;
function requireReverse$4() {
  if (hasRequiredReverse$4) return reverse_1$4;
  hasRequiredReverse$4 = 1;
  const create = requireCreate$a();
  const toSides = requireToSides();
  const reverse = (geometry) => {
    const oldsides = toSides(geometry);
    const newsides = oldsides.map((side) => [side[1], side[0]]);
    newsides.reverse();
    return create(newsides);
  };
  reverse_1$4 = reverse;
  return reverse_1$4;
}
var toOutlines_1;
var hasRequiredToOutlines;
function requireToOutlines() {
  if (hasRequiredToOutlines) return toOutlines_1;
  hasRequiredToOutlines = 1;
  const vec22 = requireVec2();
  const toSides = requireToSides();
  const toSharedVertices = (sides) => {
    const unique = /* @__PURE__ */ new Map();
    const getUniqueVertex = (vertex) => {
      const key = vertex.toString();
      if (unique.has(key)) {
        return unique.get(key);
      } else {
        unique.set(key, vertex);
        return vertex;
      }
    };
    return sides.map((side) => side.map(getUniqueVertex));
  };
  const toVertexMap = (sides) => {
    const vertexMap = /* @__PURE__ */ new Map();
    const edges = toSharedVertices(sides);
    edges.forEach((edge) => {
      if (vertexMap.has(edge[0])) {
        vertexMap.get(edge[0]).push(edge);
      } else {
        vertexMap.set(edge[0], [edge]);
      }
    });
    return vertexMap;
  };
  const toOutlines = (geometry) => {
    const vertexMap = toVertexMap(toSides(geometry));
    const outlines = [];
    while (true) {
      let startSide;
      for (const [vertex, edges] of vertexMap) {
        startSide = edges.shift();
        if (!startSide) {
          vertexMap.delete(vertex);
          continue;
        }
        break;
      }
      if (startSide === void 0) break;
      const connectedVertexPoints = [];
      const startVertex = startSide[0];
      while (true) {
        connectedVertexPoints.push(startSide[0]);
        const nextVertex = startSide[1];
        if (nextVertex === startVertex) break;
        const nextPossibleSides = vertexMap.get(nextVertex);
        if (!nextPossibleSides) {
          throw new Error(`geometry is not closed at vertex ${nextVertex}`);
        }
        const nextSide = popNextSide(startSide, nextPossibleSides);
        if (nextPossibleSides.length === 0) {
          vertexMap.delete(nextVertex);
        }
        startSide = nextSide;
      }
      if (connectedVertexPoints.length > 0) {
        connectedVertexPoints.push(connectedVertexPoints.shift());
      }
      outlines.push(connectedVertexPoints);
    }
    vertexMap.clear();
    return outlines;
  };
  const popNextSide = (startSide, nextSides) => {
    if (nextSides.length === 1) {
      return nextSides.pop();
    }
    const v0 = vec22.create();
    const startAngle = vec22.angleDegrees(vec22.subtract(v0, startSide[1], startSide[0]));
    let bestAngle;
    let bestIndex;
    nextSides.forEach((nextSide2, index) => {
      const nextAngle = vec22.angleDegrees(vec22.subtract(v0, nextSide2[1], nextSide2[0]));
      let angle2 = nextAngle - startAngle;
      if (angle2 < -180) angle2 += 360;
      if (angle2 >= 180) angle2 -= 360;
      if (bestIndex === void 0 || angle2 > bestAngle) {
        bestIndex = index;
        bestAngle = angle2;
      }
    });
    const nextSide = nextSides[bestIndex];
    nextSides.splice(bestIndex, 1);
    return nextSide;
  };
  toOutlines_1 = toOutlines;
  return toOutlines_1;
}
var toPoints_1$3;
var hasRequiredToPoints$3;
function requireToPoints$3() {
  if (hasRequiredToPoints$3) return toPoints_1$3;
  hasRequiredToPoints$3 = 1;
  const toSides = requireToSides();
  const toPoints = (geometry) => {
    const sides = toSides(geometry);
    const points = sides.map((side) => side[0]);
    if (points.length > 0) {
      points.push(points.shift());
    }
    return points;
  };
  toPoints_1$3 = toPoints;
  return toPoints_1$3;
}
var toString_1$7;
var hasRequiredToString$7;
function requireToString$7() {
  if (hasRequiredToString$7) return toString_1$7;
  hasRequiredToString$7 = 1;
  const vec22 = requireVec2();
  const toSides = requireToSides();
  const toString = (geometry) => {
    const sides = toSides(geometry);
    let result = "geom2 (" + sides.length + " sides):\n[\n";
    sides.forEach((side) => {
      result += "  [" + vec22.toString(side[0]) + ", " + vec22.toString(side[1]) + "]\n";
    });
    result += "]\n";
    return result;
  };
  toString_1$7 = toString;
  return toString_1$7;
}
var toCompactBinary_1$2;
var hasRequiredToCompactBinary$2;
function requireToCompactBinary$2() {
  if (hasRequiredToCompactBinary$2) return toCompactBinary_1$2;
  hasRequiredToCompactBinary$2 = 1;
  const toCompactBinary = (geometry) => {
    const sides = geometry.sides;
    const transforms2 = geometry.transforms;
    let color = [-1, -1, -1, -1];
    if (geometry.color) color = geometry.color;
    const compacted = new Float32Array(1 + 16 + 4 + sides.length * 4);
    compacted[0] = 0;
    compacted[1] = transforms2[0];
    compacted[2] = transforms2[1];
    compacted[3] = transforms2[2];
    compacted[4] = transforms2[3];
    compacted[5] = transforms2[4];
    compacted[6] = transforms2[5];
    compacted[7] = transforms2[6];
    compacted[8] = transforms2[7];
    compacted[9] = transforms2[8];
    compacted[10] = transforms2[9];
    compacted[11] = transforms2[10];
    compacted[12] = transforms2[11];
    compacted[13] = transforms2[12];
    compacted[14] = transforms2[13];
    compacted[15] = transforms2[14];
    compacted[16] = transforms2[15];
    compacted[17] = color[0];
    compacted[18] = color[1];
    compacted[19] = color[2];
    compacted[20] = color[3];
    for (let i = 0; i < sides.length; i++) {
      const ci = i * 4 + 21;
      const point0 = sides[i][0];
      const point1 = sides[i][1];
      compacted[ci + 0] = point0[0];
      compacted[ci + 1] = point0[1];
      compacted[ci + 2] = point1[0];
      compacted[ci + 3] = point1[1];
    }
    return compacted;
  };
  toCompactBinary_1$2 = toCompactBinary;
  return toCompactBinary_1$2;
}
var transform_1$9;
var hasRequiredTransform$9;
function requireTransform$9() {
  if (hasRequiredTransform$9) return transform_1$9;
  hasRequiredTransform$9 = 1;
  const mat42 = requireMat4();
  const reverse = requireReverse$4();
  const transform = (matrix, geometry) => {
    const transforms2 = mat42.multiply(mat42.create(), matrix, geometry.transforms);
    const transformed = Object.assign({}, geometry, { transforms: transforms2 });
    if (matrix[0] * matrix[5] - matrix[4] * matrix[1] < 0) {
      return reverse(transformed);
    }
    return transformed;
  };
  transform_1$9 = transform;
  return transform_1$9;
}
var validate_1$3;
var hasRequiredValidate$3;
function requireValidate$3() {
  if (hasRequiredValidate$3) return validate_1$3;
  hasRequiredValidate$3 = 1;
  const vec22 = requireVec2();
  const isA = requireIsA$4();
  const toOutlines = requireToOutlines();
  const validate = (object) => {
    if (!isA(object)) {
      throw new Error("invalid geom2 structure");
    }
    toOutlines(object);
    object.sides.forEach((side) => {
      if (vec22.equals(side[0], side[1])) {
        throw new Error(`geom2 self-edge ${side[0]}`);
      }
    });
    if (!object.transforms.every(Number.isFinite)) {
      throw new Error(`geom2 invalid transforms ${object.transforms}`);
    }
  };
  validate_1$3 = validate;
  return validate_1$3;
}
var geom2;
var hasRequiredGeom2;
function requireGeom2() {
  if (hasRequiredGeom2) return geom2;
  hasRequiredGeom2 = 1;
  geom2 = {
    clone: requireClone$a(),
    create: requireCreate$a(),
    fromPoints: requireFromPoints$7(),
    fromCompactBinary: requireFromCompactBinary$2(),
    isA: requireIsA$4(),
    reverse: requireReverse$4(),
    toOutlines: requireToOutlines(),
    toPoints: requireToPoints$3(),
    toSides: requireToSides(),
    toString: requireToString$7(),
    toCompactBinary: requireToCompactBinary$2(),
    transform: requireTransform$9(),
    validate: requireValidate$3()
  };
  return geom2;
}
var clone_1$6;
var hasRequiredClone$6;
function requireClone$6() {
  if (hasRequiredClone$6) return clone_1$6;
  hasRequiredClone$6 = 1;
  const clone = (geometry) => Object.assign({}, geometry);
  clone_1$6 = clone;
  return clone_1$6;
}
var create_1$8;
var hasRequiredCreate$8;
function requireCreate$8() {
  if (hasRequiredCreate$8) return create_1$8;
  hasRequiredCreate$8 = 1;
  const mat42 = requireMat4();
  const create = (polygons) => {
    if (polygons === void 0) {
      polygons = [];
    }
    return {
      polygons,
      transforms: mat42.create()
    };
  };
  create_1$8 = create;
  return create_1$8;
}
var pointLineDistance_1;
var hasRequiredPointLineDistance;
function requirePointLineDistance() {
  if (hasRequiredPointLineDistance) return pointLineDistance_1;
  hasRequiredPointLineDistance = 1;
  const cross = requireCross$1();
  const subtract = requireSubtract$3();
  const squaredLength = requireSquaredLength$1();
  const distanceSquared = (p, a, b) => {
    const ab = [];
    const ap = [];
    const cr = [];
    subtract(ab, b, a);
    subtract(ap, p, a);
    const area = squaredLength(cross(cr, ap, ab));
    const s = squaredLength(ab);
    if (s === 0) {
      throw Error("a and b are the same point");
    }
    return area / s;
  };
  const pointLineDistance = (point, a, b) => Math.sqrt(distanceSquared(point, a, b));
  pointLineDistance_1 = pointLineDistance;
  return pointLineDistance_1;
}
var getPlaneNormal;
var hasRequiredGetPlaneNormal;
function requireGetPlaneNormal() {
  if (hasRequiredGetPlaneNormal) return getPlaneNormal;
  hasRequiredGetPlaneNormal = 1;
  const cross = requireCross$1();
  const normalize = requireNormalize$1();
  const subtract = requireSubtract$3();
  const planeNormal = (out, point1, point2, point3) => {
    const tmp = [0, 0, 0];
    subtract(out, point1, point2);
    subtract(tmp, point2, point3);
    cross(out, out, tmp);
    return normalize(out, out);
  };
  getPlaneNormal = planeNormal;
  return getPlaneNormal;
}
var VertexList_1;
var hasRequiredVertexList;
function requireVertexList() {
  if (hasRequiredVertexList) return VertexList_1;
  hasRequiredVertexList = 1;
  class VertexList {
    constructor() {
      this.head = null;
      this.tail = null;
    }
    clear() {
      this.head = this.tail = null;
    }
    /**
     * Inserts a `node` before `target`, it's assumed that
     * `target` belongs to this doubly linked list
     *
     * @param {*} target
     * @param {*} node
     */
    insertBefore(target, node) {
      node.prev = target.prev;
      node.next = target;
      if (!node.prev) {
        this.head = node;
      } else {
        node.prev.next = node;
      }
      target.prev = node;
    }
    /**
     * Inserts a `node` after `target`, it's assumed that
     * `target` belongs to this doubly linked list
     *
     * @param {Vertex} target
     * @param {Vertex} node
     */
    insertAfter(target, node) {
      node.prev = target;
      node.next = target.next;
      if (!node.next) {
        this.tail = node;
      } else {
        node.next.prev = node;
      }
      target.next = node;
    }
    /**
     * Appends a `node` to the end of this doubly linked list
     * Note: `node.next` will be unlinked from `node`
     * Note: if `node` is part of another linked list call `addAll` instead
     *
     * @param {*} node
     */
    add(node) {
      if (!this.head) {
        this.head = node;
      } else {
        this.tail.next = node;
      }
      node.prev = this.tail;
      node.next = null;
      this.tail = node;
    }
    /**
     * Appends a chain of nodes where `node` is the head,
     * the difference with `add` is that it correctly sets the position
     * of the node list `tail` property
     *
     * @param {*} node
     */
    addAll(node) {
      if (!this.head) {
        this.head = node;
      } else {
        this.tail.next = node;
      }
      node.prev = this.tail;
      while (node.next) {
        node = node.next;
      }
      this.tail = node;
    }
    /**
     * Deletes a `node` from this linked list, it's assumed that `node` is a
     * member of this linked list
     *
     * @param {*} node
     */
    remove(node) {
      if (!node.prev) {
        this.head = node.next;
      } else {
        node.prev.next = node.next;
      }
      if (!node.next) {
        this.tail = node.prev;
      } else {
        node.next.prev = node.prev;
      }
    }
    /**
     * Removes a chain of nodes whose head is `a` and whose tail is `b`,
     * it's assumed that `a` and `b` belong to this list and also that `a`
     * comes before `b` in the linked list
     *
     * @param {*} a
     * @param {*} b
     */
    removeChain(a, b) {
      if (!a.prev) {
        this.head = b.next;
      } else {
        a.prev.next = b.next;
      }
      if (!b.next) {
        this.tail = a.prev;
      } else {
        b.next.prev = a.prev;
      }
    }
    first() {
      return this.head;
    }
    isEmpty() {
      return !this.head;
    }
  }
  VertexList_1 = VertexList;
  return VertexList_1;
}
var Vertex_1;
var hasRequiredVertex;
function requireVertex() {
  if (hasRequiredVertex) return Vertex_1;
  hasRequiredVertex = 1;
  class Vertex {
    constructor(point, index) {
      this.point = point;
      this.index = index;
      this.next = null;
      this.prev = null;
      this.face = null;
    }
  }
  Vertex_1 = Vertex;
  return Vertex_1;
}
var HalfEdge_1;
var hasRequiredHalfEdge;
function requireHalfEdge() {
  if (hasRequiredHalfEdge) return HalfEdge_1;
  hasRequiredHalfEdge = 1;
  const distance = requireDistance$1();
  const squaredDistance = requireSquaredDistance$1();
  class HalfEdge {
    constructor(vertex, face) {
      this.vertex = vertex;
      this.face = face;
      this.next = null;
      this.prev = null;
      this.opposite = null;
    }
    head() {
      return this.vertex;
    }
    tail() {
      return this.prev ? this.prev.vertex : null;
    }
    length() {
      if (this.tail()) {
        return distance(
          this.tail().point,
          this.head().point
        );
      }
      return -1;
    }
    lengthSquared() {
      if (this.tail()) {
        return squaredDistance(
          this.tail().point,
          this.head().point
        );
      }
      return -1;
    }
    setOpposite(edge) {
      this.opposite = edge;
      edge.opposite = this;
    }
  }
  HalfEdge_1 = HalfEdge;
  return HalfEdge_1;
}
var Face_1;
var hasRequiredFace;
function requireFace() {
  if (hasRequiredFace) return Face_1;
  hasRequiredFace = 1;
  const add = requireAdd$1();
  const copy = requireCopy$4();
  const cross = requireCross$1();
  const dot = requireDot$2();
  const length = requireLength$2();
  const normalize = requireNormalize$1();
  const scale = requireScale$3();
  const subtract = requireSubtract$3();
  const HalfEdge = requireHalfEdge();
  const VISIBLE = 0;
  const NON_CONVEX = 1;
  const DELETED = 2;
  class Face {
    constructor() {
      this.normal = [];
      this.centroid = [];
      this.offset = 0;
      this.outside = null;
      this.mark = VISIBLE;
      this.edge = null;
      this.nVertices = 0;
    }
    getEdge(i) {
      if (typeof i !== "number") {
        throw Error("requires a number");
      }
      let it = this.edge;
      while (i > 0) {
        it = it.next;
        i -= 1;
      }
      while (i < 0) {
        it = it.prev;
        i += 1;
      }
      return it;
    }
    computeNormal() {
      const e0 = this.edge;
      const e1 = e0.next;
      let e2 = e1.next;
      const v22 = subtract([], e1.head().point, e0.head().point);
      const t = [];
      const v1 = [];
      this.nVertices = 2;
      this.normal = [0, 0, 0];
      while (e2 !== e0) {
        copy(v1, v22);
        subtract(v22, e2.head().point, e0.head().point);
        add(this.normal, this.normal, cross(t, v1, v22));
        e2 = e2.next;
        this.nVertices += 1;
      }
      this.area = length(this.normal);
      this.normal = scale(this.normal, this.normal, 1 / this.area);
    }
    computeNormalMinArea(minArea) {
      this.computeNormal();
      if (this.area < minArea) {
        let maxEdge;
        let maxSquaredLength = 0;
        let edge = this.edge;
        do {
          const lengthSquared = edge.lengthSquared();
          if (lengthSquared > maxSquaredLength) {
            maxEdge = edge;
            maxSquaredLength = lengthSquared;
          }
          edge = edge.next;
        } while (edge !== this.edge);
        const p1 = maxEdge.tail().point;
        const p2 = maxEdge.head().point;
        const maxVector = subtract([], p2, p1);
        const maxLength = Math.sqrt(maxSquaredLength);
        scale(maxVector, maxVector, 1 / maxLength);
        const maxProjection = dot(this.normal, maxVector);
        scale(maxVector, maxVector, -maxProjection);
        add(this.normal, this.normal, maxVector);
        normalize(this.normal, this.normal);
      }
    }
    computeCentroid() {
      this.centroid = [0, 0, 0];
      let edge = this.edge;
      do {
        add(this.centroid, this.centroid, edge.head().point);
        edge = edge.next;
      } while (edge !== this.edge);
      scale(this.centroid, this.centroid, 1 / this.nVertices);
    }
    computeNormalAndCentroid(minArea) {
      if (typeof minArea !== "undefined") {
        this.computeNormalMinArea(minArea);
      } else {
        this.computeNormal();
      }
      this.computeCentroid();
      this.offset = dot(this.normal, this.centroid);
    }
    distanceToPlane(point) {
      return dot(this.normal, point) - this.offset;
    }
    /**
     * @private
     *
     * Connects two edges assuming that prev.head().point === next.tail().point
     *
     * @param {HalfEdge} prev
     * @param {HalfEdge} next
     */
    connectHalfEdges(prev, next) {
      let discardedFace;
      if (prev.opposite.face === next.opposite.face) {
        const oppositeFace = next.opposite.face;
        let oppositeEdge;
        if (prev === this.edge) {
          this.edge = next;
        }
        if (oppositeFace.nVertices === 3) {
          oppositeEdge = next.opposite.prev.opposite;
          oppositeFace.mark = DELETED;
          discardedFace = oppositeFace;
        } else {
          oppositeEdge = next.opposite.next;
          if (oppositeFace.edge === oppositeEdge.prev) {
            oppositeFace.edge = oppositeEdge;
          }
          oppositeEdge.prev = oppositeEdge.prev.prev;
          oppositeEdge.prev.next = oppositeEdge;
        }
        next.prev = prev.prev;
        next.prev.next = next;
        next.setOpposite(oppositeEdge);
        oppositeFace.computeNormalAndCentroid();
      } else {
        prev.next = next;
        next.prev = prev;
      }
      return discardedFace;
    }
    mergeAdjacentFaces(adjacentEdge, discardedFaces) {
      const oppositeEdge = adjacentEdge.opposite;
      const oppositeFace = oppositeEdge.face;
      discardedFaces.push(oppositeFace);
      oppositeFace.mark = DELETED;
      let adjacentEdgePrev = adjacentEdge.prev;
      let adjacentEdgeNext = adjacentEdge.next;
      let oppositeEdgePrev = oppositeEdge.prev;
      let oppositeEdgeNext = oppositeEdge.next;
      while (adjacentEdgePrev.opposite.face === oppositeFace) {
        adjacentEdgePrev = adjacentEdgePrev.prev;
        oppositeEdgeNext = oppositeEdgeNext.next;
      }
      while (adjacentEdgeNext.opposite.face === oppositeFace) {
        adjacentEdgeNext = adjacentEdgeNext.next;
        oppositeEdgePrev = oppositeEdgePrev.prev;
      }
      let edge;
      for (edge = oppositeEdgeNext; edge !== oppositeEdgePrev.next; edge = edge.next) {
        edge.face = this;
      }
      this.edge = adjacentEdgeNext;
      let discardedFace;
      discardedFace = this.connectHalfEdges(oppositeEdgePrev, adjacentEdgeNext);
      if (discardedFace) {
        discardedFaces.push(discardedFace);
      }
      discardedFace = this.connectHalfEdges(adjacentEdgePrev, oppositeEdgeNext);
      if (discardedFace) {
        discardedFaces.push(discardedFace);
      }
      this.computeNormalAndCentroid();
      return discardedFaces;
    }
    collectIndices() {
      const indices = [];
      let edge = this.edge;
      do {
        indices.push(edge.head().index);
        edge = edge.next;
      } while (edge !== this.edge);
      return indices;
    }
    static createTriangle(v0, v1, v22, minArea = 0) {
      const face = new Face();
      const e0 = new HalfEdge(v0, face);
      const e1 = new HalfEdge(v1, face);
      const e2 = new HalfEdge(v22, face);
      e0.next = e2.prev = e1;
      e1.next = e0.prev = e2;
      e2.next = e1.prev = e0;
      face.edge = e0;
      face.computeNormalAndCentroid(minArea);
      return face;
    }
  }
  Face_1 = {
    VISIBLE,
    NON_CONVEX,
    DELETED,
    Face
  };
  return Face_1;
}
var QuickHull_1;
var hasRequiredQuickHull;
function requireQuickHull() {
  if (hasRequiredQuickHull) return QuickHull_1;
  hasRequiredQuickHull = 1;
  const dot = requireDot$2();
  const pointLineDistance = requirePointLineDistance();
  const getPlaneNormal2 = requireGetPlaneNormal();
  const VertexList = requireVertexList();
  const Vertex = requireVertex();
  const { Face, VISIBLE, NON_CONVEX, DELETED } = requireFace();
  const MERGE_NON_CONVEX_WRT_LARGER_FACE = 1;
  const MERGE_NON_CONVEX = 2;
  class QuickHull {
    constructor(points) {
      if (!Array.isArray(points)) {
        throw TypeError("input is not a valid array");
      }
      if (points.length < 4) {
        throw Error("cannot build a simplex out of <4 points");
      }
      this.tolerance = -1;
      this.nFaces = 0;
      this.nPoints = points.length;
      this.faces = [];
      this.newFaces = [];
      this.claimed = new VertexList();
      this.unclaimed = new VertexList();
      this.vertices = [];
      for (let i = 0; i < points.length; i += 1) {
        this.vertices.push(new Vertex(points[i], i));
      }
      this.discardedFaces = [];
      this.vertexPointIndices = [];
    }
    addVertexToFace(vertex, face) {
      vertex.face = face;
      if (!face.outside) {
        this.claimed.add(vertex);
      } else {
        this.claimed.insertBefore(face.outside, vertex);
      }
      face.outside = vertex;
    }
    /**
     * Removes `vertex` for the `claimed` list of vertices, it also makes sure
     * that the link from `face` to the first vertex it sees in `claimed` is
     * linked correctly after the removal
     *
     * @param {Vertex} vertex
     * @param {Face} face
     */
    removeVertexFromFace(vertex, face) {
      if (vertex === face.outside) {
        if (vertex.next && vertex.next.face === face) {
          face.outside = vertex.next;
        } else {
          face.outside = null;
        }
      }
      this.claimed.remove(vertex);
    }
    /**
     * Removes all the visible vertices that `face` is able to see which are
     * stored in the `claimed` vertext list
     *
     * @param {Face} face
     * @return {Vertex|undefined} If face had visible vertices returns
     * `face.outside`, otherwise undefined
     */
    removeAllVerticesFromFace(face) {
      if (face.outside) {
        let end = face.outside;
        while (end.next && end.next.face === face) {
          end = end.next;
        }
        this.claimed.removeChain(face.outside, end);
        end.next = null;
        return face.outside;
      }
    }
    /**
     * Removes all the visible vertices that `face` is able to see, additionally
     * checking the following:
     *
     * If `absorbingFace` doesn't exist then all the removed vertices will be
     * added to the `unclaimed` vertex list
     *
     * If `absorbingFace` exists then this method will assign all the vertices of
     * `face` that can see `absorbingFace`, if a vertex cannot see `absorbingFace`
     * it's added to the `unclaimed` vertex list
     *
     * @param {Face} face
     * @param {Face} [absorbingFace]
     */
    deleteFaceVertices(face, absorbingFace) {
      const faceVertices = this.removeAllVerticesFromFace(face);
      if (faceVertices) {
        if (!absorbingFace) {
          this.unclaimed.addAll(faceVertices);
        } else {
          let nextVertex;
          for (let vertex = faceVertices; vertex; vertex = nextVertex) {
            nextVertex = vertex.next;
            const distance = absorbingFace.distanceToPlane(vertex.point);
            if (distance > this.tolerance) {
              this.addVertexToFace(vertex, absorbingFace);
            } else {
              this.unclaimed.add(vertex);
            }
          }
        }
      }
    }
    /**
     * Reassigns as many vertices as possible from the unclaimed list to the new
     * faces
     *
     * @param {Faces[]} newFaces
     */
    resolveUnclaimedPoints(newFaces) {
      let vertexNext = this.unclaimed.first();
      for (let vertex = vertexNext; vertex; vertex = vertexNext) {
        vertexNext = vertex.next;
        let maxDistance = this.tolerance;
        let maxFace;
        for (let i = 0; i < newFaces.length; i += 1) {
          const face = newFaces[i];
          if (face.mark === VISIBLE) {
            const dist = face.distanceToPlane(vertex.point);
            if (dist > maxDistance) {
              maxDistance = dist;
              maxFace = face;
            }
            if (maxDistance > 1e3 * this.tolerance) {
              break;
            }
          }
        }
        if (maxFace) {
          this.addVertexToFace(vertex, maxFace);
        }
      }
    }
    /**
     * Computes the extremes of a tetrahedron which will be the initial hull
     *
     * @return {number[]} The min/max vertices in the x,y,z directions
     */
    computeExtremes() {
      const min = [];
      const max = [];
      const minVertices = [];
      const maxVertices = [];
      let i, j;
      for (i = 0; i < 3; i += 1) {
        minVertices[i] = maxVertices[i] = this.vertices[0];
      }
      for (i = 0; i < 3; i += 1) {
        min[i] = max[i] = this.vertices[0].point[i];
      }
      for (i = 1; i < this.vertices.length; i += 1) {
        const vertex = this.vertices[i];
        const point = vertex.point;
        for (j = 0; j < 3; j += 1) {
          if (point[j] < min[j]) {
            min[j] = point[j];
            minVertices[j] = vertex;
          }
        }
        for (j = 0; j < 3; j += 1) {
          if (point[j] > max[j]) {
            max[j] = point[j];
            maxVertices[j] = vertex;
          }
        }
      }
      this.tolerance = 3 * Number.EPSILON * (Math.max(Math.abs(min[0]), Math.abs(max[0])) + Math.max(Math.abs(min[1]), Math.abs(max[1])) + Math.max(Math.abs(min[2]), Math.abs(max[2])));
      return [minVertices, maxVertices];
    }
    /**
     * Compues the initial tetrahedron assigning to its faces all the points that
     * are candidates to form part of the hull
     */
    createInitialSimplex() {
      const vertices = this.vertices;
      const [min, max] = this.computeExtremes();
      let v22, v32;
      let i, j;
      let maxDistance = 0;
      let indexMax = 0;
      for (i = 0; i < 3; i += 1) {
        const distance = max[i].point[i] - min[i].point[i];
        if (distance > maxDistance) {
          maxDistance = distance;
          indexMax = i;
        }
      }
      const v0 = min[indexMax];
      const v1 = max[indexMax];
      maxDistance = 0;
      for (i = 0; i < this.vertices.length; i += 1) {
        const vertex = this.vertices[i];
        if (vertex !== v0 && vertex !== v1) {
          const distance = pointLineDistance(
            vertex.point,
            v0.point,
            v1.point
          );
          if (distance > maxDistance) {
            maxDistance = distance;
            v22 = vertex;
          }
        }
      }
      const normal = getPlaneNormal2([], v0.point, v1.point, v22.point);
      const distPO = dot(v0.point, normal);
      maxDistance = -1;
      for (i = 0; i < this.vertices.length; i += 1) {
        const vertex = this.vertices[i];
        if (vertex !== v0 && vertex !== v1 && vertex !== v22) {
          const distance = Math.abs(dot(normal, vertex.point) - distPO);
          if (distance > maxDistance) {
            maxDistance = distance;
            v32 = vertex;
          }
        }
      }
      const faces = [];
      if (dot(v32.point, normal) - distPO < 0) {
        faces.push(
          Face.createTriangle(v0, v1, v22),
          Face.createTriangle(v32, v1, v0),
          Face.createTriangle(v32, v22, v1),
          Face.createTriangle(v32, v0, v22)
        );
        for (i = 0; i < 3; i += 1) {
          const j2 = (i + 1) % 3;
          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(j2));
          faces[i + 1].getEdge(1).setOpposite(faces[j2 + 1].getEdge(0));
        }
      } else {
        faces.push(
          Face.createTriangle(v0, v22, v1),
          Face.createTriangle(v32, v0, v1),
          Face.createTriangle(v32, v1, v22),
          Face.createTriangle(v32, v22, v0)
        );
        for (i = 0; i < 3; i += 1) {
          const j2 = (i + 1) % 3;
          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge((3 - i) % 3));
          faces[i + 1].getEdge(0).setOpposite(faces[j2 + 1].getEdge(1));
        }
      }
      for (i = 0; i < 4; i += 1) {
        this.faces.push(faces[i]);
      }
      for (i = 0; i < vertices.length; i += 1) {
        const vertex = vertices[i];
        if (vertex !== v0 && vertex !== v1 && vertex !== v22 && vertex !== v32) {
          maxDistance = this.tolerance;
          let maxFace;
          for (j = 0; j < 4; j += 1) {
            const distance = faces[j].distanceToPlane(vertex.point);
            if (distance > maxDistance) {
              maxDistance = distance;
              maxFace = faces[j];
            }
          }
          if (maxFace) {
            this.addVertexToFace(vertex, maxFace);
          }
        }
      }
    }
    reindexFaceAndVertices() {
      const activeFaces = [];
      for (let i = 0; i < this.faces.length; i += 1) {
        const face = this.faces[i];
        if (face.mark === VISIBLE) {
          activeFaces.push(face);
        }
      }
      this.faces = activeFaces;
    }
    collectFaces(skipTriangulation) {
      const faceIndices = [];
      for (let i = 0; i < this.faces.length; i += 1) {
        if (this.faces[i].mark !== VISIBLE) {
          throw Error("attempt to include a destroyed face in the hull");
        }
        const indices = this.faces[i].collectIndices();
        if (skipTriangulation) {
          faceIndices.push(indices);
        } else {
          for (let j = 0; j < indices.length - 2; j += 1) {
            faceIndices.push(
              [indices[0], indices[j + 1], indices[j + 2]]
            );
          }
        }
      }
      return faceIndices;
    }
    /**
     * Finds the next vertex to make faces with the current hull
     *
     * - let `face` be the first face existing in the `claimed` vertex list
     *  - if `face` doesn't exist then return since there're no vertices left
     *  - otherwise for each `vertex` that face sees find the one furthest away
     *  from `face`
     *
     * @return {Vertex|undefined} Returns undefined when there're no more
     * visible vertices
     */
    nextVertexToAdd() {
      if (!this.claimed.isEmpty()) {
        let eyeVertex, vertex;
        let maxDistance = 0;
        const eyeFace = this.claimed.first().face;
        for (vertex = eyeFace.outside; vertex && vertex.face === eyeFace; vertex = vertex.next) {
          const distance = eyeFace.distanceToPlane(vertex.point);
          if (distance > maxDistance) {
            maxDistance = distance;
            eyeVertex = vertex;
          }
        }
        return eyeVertex;
      }
    }
    /**
     * Computes a chain of half edges in ccw order called the `horizon`, for an
     * edge to be part of the horizon it must join a face that can see
     * `eyePoint` and a face that cannot see `eyePoint`
     *
     * @param {number[]} eyePoint - The coordinates of a point
     * @param {HalfEdge} crossEdge - The edge used to jump to the current `face`
     * @param {Face} face - The current face being tested
     * @param {HalfEdge[]} horizon - The edges that form part of the horizon in
     * ccw order
     */
    computeHorizon(eyePoint, crossEdge, face, horizon) {
      this.deleteFaceVertices(face);
      face.mark = DELETED;
      let edge;
      if (!crossEdge) {
        edge = crossEdge = face.getEdge(0);
      } else {
        edge = crossEdge.next;
      }
      do {
        const oppositeEdge = edge.opposite;
        const oppositeFace = oppositeEdge.face;
        if (oppositeFace.mark === VISIBLE) {
          if (oppositeFace.distanceToPlane(eyePoint) > this.tolerance) {
            this.computeHorizon(eyePoint, oppositeEdge, oppositeFace, horizon);
          } else {
            horizon.push(edge);
          }
        }
        edge = edge.next;
      } while (edge !== crossEdge);
    }
    /**
     * Creates a face with the points `eyeVertex.point`, `horizonEdge.tail` and
     * `horizonEdge.tail` in ccw order
     *
     * @param {Vertex} eyeVertex
     * @param {HalfEdge} horizonEdge
     * @return {HalfEdge} The half edge whose vertex is the eyeVertex
     */
    addAdjoiningFace(eyeVertex, horizonEdge) {
      const face = Face.createTriangle(
        eyeVertex,
        horizonEdge.tail(),
        horizonEdge.head()
      );
      this.faces.push(face);
      face.getEdge(-1).setOpposite(horizonEdge.opposite);
      return face.getEdge(0);
    }
    /**
     * Adds horizon.length faces to the hull, each face will be 'linked' with the
     * horizon opposite face and the face on the left/right
     *
     * @param {Vertex} eyeVertex
     * @param {HalfEdge[]} horizon - A chain of half edges in ccw order
     */
    addNewFaces(eyeVertex, horizon) {
      this.newFaces = [];
      let firstSideEdge, previousSideEdge;
      for (let i = 0; i < horizon.length; i += 1) {
        const horizonEdge = horizon[i];
        const sideEdge = this.addAdjoiningFace(eyeVertex, horizonEdge);
        if (!firstSideEdge) {
          firstSideEdge = sideEdge;
        } else {
          sideEdge.next.setOpposite(previousSideEdge);
        }
        this.newFaces.push(sideEdge.face);
        previousSideEdge = sideEdge;
      }
      firstSideEdge.next.setOpposite(previousSideEdge);
    }
    /**
     * Computes the distance from `edge` opposite face's centroid to
     * `edge.face`
     *
     * @param {HalfEdge} edge
     * @return {number}
     * - A positive number when the centroid of the opposite face is above the
     *   face i.e. when the faces are concave
     * - A negative number when the centroid of the opposite face is below the
     *   face i.e. when the faces are convex
     */
    oppositeFaceDistance(edge) {
      return edge.face.distanceToPlane(edge.opposite.face.centroid);
    }
    /**
     * Merges a face with none/any/all its neighbors according to the strategy
     * used
     *
     * if `mergeType` is MERGE_NON_CONVEX_WRT_LARGER_FACE then the merge will be
     * decided based on the face with the larger area, the centroid of the face
     * with the smaller area will be checked against the one with the larger area
     * to see if it's in the merge range [tolerance, -tolerance] i.e.
     *
     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
     *
     * Note that the first check (with +tolerance) was done on `computeHorizon`
     *
     * If the above is not true then the check is done with respect to the smaller
     * face i.e.
     *
     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
     *
     * If true then it means that two faces are non convex (concave), even if the
     * dot(...) - offset value is > 0 (that's the point of doing the merge in the
     * first place)
     *
     * If two faces are concave then the check must also be done on the other face
     * but this is done in another merge pass, for this to happen the face is
     * marked in a temporal NON_CONVEX state
     *
     * if `mergeType` is MERGE_NON_CONVEX then two faces will be merged only if
     * they pass the following conditions
     *
     *    dot(centroid smaller face, larger face normal) - larger face offset > -tolerance
     *    dot(centroid larger face, smaller face normal) - smaller face offset > -tolerance
     *
     * @param {Face} face
     * @param {number} mergeType - Either MERGE_NON_CONVEX_WRT_LARGER_FACE or
     * MERGE_NON_CONVEX
     */
    doAdjacentMerge(face, mergeType) {
      let edge = face.edge;
      let convex = true;
      let it = 0;
      do {
        if (it >= face.nVertices) {
          throw Error("merge recursion limit exceeded");
        }
        const oppositeFace = edge.opposite.face;
        let merge = false;
        if (mergeType === MERGE_NON_CONVEX) {
          if (this.oppositeFaceDistance(edge) > -this.tolerance || this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
            merge = true;
          }
        } else {
          if (face.area > oppositeFace.area) {
            if (this.oppositeFaceDistance(edge) > -this.tolerance) {
              merge = true;
            } else if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
              convex = false;
            }
          } else {
            if (this.oppositeFaceDistance(edge.opposite) > -this.tolerance) {
              merge = true;
            } else if (this.oppositeFaceDistance(edge) > -this.tolerance) {
              convex = false;
            }
          }
        }
        if (merge) {
          const discardedFaces = face.mergeAdjacentFaces(edge, []);
          for (let i = 0; i < discardedFaces.length; i += 1) {
            this.deleteFaceVertices(discardedFaces[i], face);
          }
          return true;
        }
        edge = edge.next;
        it += 1;
      } while (edge !== face.edge);
      if (!convex) {
        face.mark = NON_CONVEX;
      }
      return false;
    }
    /**
     * Adds a vertex to the hull with the following algorithm
     *
     * - Compute the `horizon` which is a chain of half edges, for an edge to
     *   belong to this group it must be the edge connecting a face that can
     *   see `eyeVertex` and a face which cannot see `eyeVertex`
     * - All the faces that can see `eyeVertex` have its visible vertices removed
     *   from the claimed VertexList
     * - A new set of faces is created with each edge of the `horizon` and
     *   `eyeVertex`, each face is connected with the opposite horizon face and
     *   the face on the left/right
     * - The new faces are merged if possible with the opposite horizon face first
     *   and then the faces on the right/left
     * - The vertices removed from all the visible faces are assigned to the new
     *   faces if possible
     *
     * @param {Vertex} eyeVertex
     */
    addVertexToHull(eyeVertex) {
      const horizon = [];
      this.unclaimed.clear();
      this.removeVertexFromFace(eyeVertex, eyeVertex.face);
      this.computeHorizon(eyeVertex.point, null, eyeVertex.face, horizon);
      this.addNewFaces(eyeVertex, horizon);
      for (let i = 0; i < this.newFaces.length; i += 1) {
        const face = this.newFaces[i];
        if (face.mark === VISIBLE) {
          while (this.doAdjacentMerge(face, MERGE_NON_CONVEX_WRT_LARGER_FACE)) {
          }
        }
      }
      for (let i = 0; i < this.newFaces.length; i += 1) {
        const face = this.newFaces[i];
        if (face.mark === NON_CONVEX) {
          face.mark = VISIBLE;
          while (this.doAdjacentMerge(face, MERGE_NON_CONVEX)) {
          }
        }
      }
      this.resolveUnclaimedPoints(this.newFaces);
    }
    build() {
      let eyeVertex;
      this.createInitialSimplex();
      while (eyeVertex = this.nextVertexToAdd()) {
        this.addVertexToHull(eyeVertex);
      }
      this.reindexFaceAndVertices();
    }
  }
  QuickHull_1 = QuickHull;
  return QuickHull_1;
}
var quickhull;
var hasRequiredQuickhull;
function requireQuickhull() {
  if (hasRequiredQuickhull) return quickhull;
  hasRequiredQuickhull = 1;
  const QuickHull = requireQuickHull();
  const runner = (points, options = {}) => {
    const instance = new QuickHull(points);
    instance.build();
    return instance.collectFaces(options.skipTriangulation);
  };
  quickhull = runner;
  return quickhull;
}
var create_1$7;
var hasRequiredCreate$7;
function requireCreate$7() {
  if (hasRequiredCreate$7) return create_1$7;
  hasRequiredCreate$7 = 1;
  const create = (vertices) => {
    if (vertices === void 0 || vertices.length < 3) {
      vertices = [];
    }
    return { vertices };
  };
  create_1$7 = create;
  return create_1$7;
}
var clone_1$5;
var hasRequiredClone$5;
function requireClone$5() {
  if (hasRequiredClone$5) return clone_1$5;
  hasRequiredClone$5 = 1;
  const create = requireCreate$7();
  const vec32 = requireVec3();
  const clone = (...params) => {
    let out;
    let poly32;
    if (params.length === 1) {
      out = create();
      poly32 = params[0];
    } else {
      out = params[0];
      poly32 = params[1];
    }
    out.vertices = poly32.vertices.map((vec) => vec32.clone(vec));
    return out;
  };
  clone_1$5 = clone;
  return clone_1$5;
}
var fromPoints_1$6;
var hasRequiredFromPoints$6;
function requireFromPoints$6() {
  if (hasRequiredFromPoints$6) return fromPoints_1$6;
  hasRequiredFromPoints$6 = 1;
  const vec32 = requireVec3();
  const create = requireCreate$7();
  const fromPoints = (points) => {
    const vertices = points.map((point) => vec32.clone(point));
    return create(vertices);
  };
  fromPoints_1$6 = fromPoints;
  return fromPoints_1$6;
}
var fromPointsAndPlane_1;
var hasRequiredFromPointsAndPlane;
function requireFromPointsAndPlane() {
  if (hasRequiredFromPointsAndPlane) return fromPointsAndPlane_1;
  hasRequiredFromPointsAndPlane = 1;
  const create = requireCreate$7();
  const fromPointsAndPlane = (vertices, plane2) => {
    const poly = create(vertices);
    poly.plane = plane2;
    return poly;
  };
  fromPointsAndPlane_1 = fromPointsAndPlane;
  return fromPointsAndPlane_1;
}
var create_1$6;
var hasRequiredCreate$6;
function requireCreate$6() {
  if (hasRequiredCreate$6) return create_1$6;
  hasRequiredCreate$6 = 1;
  const create = () => [0, 0, 0, 0];
  create_1$6 = create;
  return create_1$6;
}
var clone_1$4;
var hasRequiredClone$4;
function requireClone$4() {
  if (hasRequiredClone$4) return clone_1$4;
  hasRequiredClone$4 = 1;
  const create = requireCreate$6();
  const clone = (vector) => {
    const out = create();
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    out[3] = vector[3];
    return out;
  };
  clone_1$4 = clone;
  return clone_1$4;
}
var copy_1$2;
var hasRequiredCopy$2;
function requireCopy$2() {
  if (hasRequiredCopy$2) return copy_1$2;
  hasRequiredCopy$2 = 1;
  const copy = (out, vector) => {
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = vector[2];
    out[3] = vector[3];
    return out;
  };
  copy_1$2 = copy;
  return copy_1$2;
}
var equals_1$4;
var hasRequiredEquals$4;
function requireEquals$4() {
  if (hasRequiredEquals$4) return equals_1$4;
  hasRequiredEquals$4 = 1;
  const equals = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
  equals_1$4 = equals;
  return equals_1$4;
}
var flip_1$1;
var hasRequiredFlip$1;
function requireFlip$1() {
  if (hasRequiredFlip$1) return flip_1$1;
  hasRequiredFlip$1 = 1;
  const flip = (out, plane2) => {
    out[0] = -plane2[0];
    out[1] = -plane2[1];
    out[2] = -plane2[2];
    out[3] = -plane2[3];
    return out;
  };
  flip_1$1 = flip;
  return flip_1$1;
}
var fromNormalAndPoint_1;
var hasRequiredFromNormalAndPoint;
function requireFromNormalAndPoint() {
  if (hasRequiredFromNormalAndPoint) return fromNormalAndPoint_1;
  hasRequiredFromNormalAndPoint = 1;
  const vec32 = requireVec3();
  const fromNormalAndPoint = (out, normal, point) => {
    const u = vec32.normalize(vec32.create(), normal);
    const w = vec32.dot(point, u);
    out[0] = u[0];
    out[1] = u[1];
    out[2] = u[2];
    out[3] = w;
    return out;
  };
  fromNormalAndPoint_1 = fromNormalAndPoint;
  return fromNormalAndPoint_1;
}
var fromValues_1$1;
var hasRequiredFromValues$1;
function requireFromValues$1() {
  if (hasRequiredFromValues$1) return fromValues_1$1;
  hasRequiredFromValues$1 = 1;
  const create = requireCreate$6();
  const fromValues = (x, y, z, w) => {
    const out = create();
    out[0] = x;
    out[1] = y;
    out[2] = z;
    out[3] = w;
    return out;
  };
  fromValues_1$1 = fromValues;
  return fromValues_1$1;
}
var fromNoisyPoints_1;
var hasRequiredFromNoisyPoints;
function requireFromNoisyPoints() {
  if (hasRequiredFromNoisyPoints) return fromNoisyPoints_1;
  hasRequiredFromNoisyPoints = 1;
  const vec32 = requireVec3();
  const fromNormalAndPoint = requireFromNormalAndPoint();
  const fromNoisyPoints = (out, ...vertices) => {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    const n = vertices.length;
    vertices.forEach((v) => {
      vec32.add(out, out, v);
    });
    vec32.scale(out, out, 1 / n);
    let xx = 0;
    let xy = 0;
    let xz = 0;
    let yy = 0;
    let yz = 0;
    let zz = 0;
    const vn = vec32.create();
    vertices.forEach((v) => {
      vec32.subtract(vn, v, out);
      xx += vn[0] * vn[0];
      xy += vn[0] * vn[1];
      xz += vn[0] * vn[2];
      yy += vn[1] * vn[1];
      yz += vn[1] * vn[2];
      zz += vn[2] * vn[2];
    });
    xx /= n;
    xy /= n;
    xz /= n;
    yy /= n;
    yz /= n;
    zz /= n;
    vn[0] = 0;
    vn[1] = 0;
    vn[2] = 0;
    const wdv = vec32.create();
    let det = yy * zz - yz * yz;
    wdv[0] = det;
    wdv[1] = xz * yz - xy * zz;
    wdv[2] = xy * yz - xz * yy;
    let weight = det * det;
    vec32.add(vn, vn, vec32.scale(wdv, wdv, weight));
    det = xx * zz - xz * xz;
    wdv[0] = xz * yz - xy * zz;
    wdv[1] = det;
    wdv[2] = xy * xz - yz * xx;
    weight = det * det;
    if (vec32.dot(vn, wdv) < 0) {
      weight = -weight;
    }
    vec32.add(vn, vn, vec32.scale(wdv, wdv, weight));
    det = xx * yy - xy * xy;
    wdv[0] = xy * yz - xz * yy;
    wdv[1] = xy * xz - yz * xx;
    wdv[2] = det;
    weight = det * det;
    if (vec32.dot(vn, wdv) < 0) {
      weight = -weight;
    }
    vec32.add(vn, vn, vec32.scale(wdv, wdv, weight));
    return fromNormalAndPoint(out, vn, out);
  };
  fromNoisyPoints_1 = fromNoisyPoints;
  return fromNoisyPoints_1;
}
var fromPoints_1$5;
var hasRequiredFromPoints$5;
function requireFromPoints$5() {
  if (hasRequiredFromPoints$5) return fromPoints_1$5;
  hasRequiredFromPoints$5 = 1;
  const vec32 = requireVec3();
  const fromPoints = (out, ...vertices) => {
    const len = vertices.length;
    const ba = vec32.create();
    const ca = vec32.create();
    const vertexNormal = (index) => {
      const a = vertices[index];
      const b = vertices[(index + 1) % len];
      const c = vertices[(index + 2) % len];
      vec32.subtract(ba, b, a);
      vec32.subtract(ca, c, a);
      vec32.cross(ba, ba, ca);
      vec32.normalize(ba, ba);
      return ba;
    };
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    if (len === 3) {
      vec32.copy(out, vertexNormal(0));
    } else {
      vertices.forEach((v, i) => {
        vec32.add(out, out, vertexNormal(i));
      });
      vec32.normalize(out, out);
    }
    out[3] = vec32.dot(out, vertices[0]);
    return out;
  };
  fromPoints_1$5 = fromPoints;
  return fromPoints_1$5;
}
var fromPointsRandom_1;
var hasRequiredFromPointsRandom;
function requireFromPointsRandom() {
  if (hasRequiredFromPointsRandom) return fromPointsRandom_1;
  hasRequiredFromPointsRandom = 1;
  const { EPS } = requireConstants();
  const vec32 = requireVec3();
  const fromPointsRandom = (out, a, b, c) => {
    let ba = vec32.subtract(vec32.create(), b, a);
    let ca = vec32.subtract(vec32.create(), c, a);
    if (vec32.length(ba) < EPS) {
      ba = vec32.orthogonal(ba, ca);
    }
    if (vec32.length(ca) < EPS) {
      ca = vec32.orthogonal(ca, ba);
    }
    let normal = vec32.cross(vec32.create(), ba, ca);
    if (vec32.length(normal) < EPS) {
      ca = vec32.orthogonal(ca, ba);
      normal = vec32.cross(normal, ba, ca);
    }
    normal = vec32.normalize(normal, normal);
    const w = vec32.dot(normal, a);
    out[0] = normal[0];
    out[1] = normal[1];
    out[2] = normal[2];
    out[3] = w;
    return out;
  };
  fromPointsRandom_1 = fromPointsRandom;
  return fromPointsRandom_1;
}
var projectionOfPoint_1;
var hasRequiredProjectionOfPoint;
function requireProjectionOfPoint() {
  if (hasRequiredProjectionOfPoint) return projectionOfPoint_1;
  hasRequiredProjectionOfPoint = 1;
  const vec32 = requireVec3();
  const projectionOfPoint = (plane2, point) => {
    const a = point[0] * plane2[0] + point[1] * plane2[1] + point[2] * plane2[2] - plane2[3];
    const x = point[0] - a * plane2[0];
    const y = point[1] - a * plane2[1];
    const z = point[2] - a * plane2[2];
    return vec32.fromValues(x, y, z);
  };
  projectionOfPoint_1 = projectionOfPoint;
  return projectionOfPoint_1;
}
var signedDistanceToPoint_1;
var hasRequiredSignedDistanceToPoint;
function requireSignedDistanceToPoint() {
  if (hasRequiredSignedDistanceToPoint) return signedDistanceToPoint_1;
  hasRequiredSignedDistanceToPoint = 1;
  const vec32 = requireVec3();
  const signedDistanceToPoint = (plane2, point) => vec32.dot(plane2, point) - plane2[3];
  signedDistanceToPoint_1 = signedDistanceToPoint;
  return signedDistanceToPoint_1;
}
var toString_1$6;
var hasRequiredToString$6;
function requireToString$6() {
  if (hasRequiredToString$6) return toString_1$6;
  hasRequiredToString$6 = 1;
  const toString = (vec) => `(${vec[0].toFixed(9)}, ${vec[1].toFixed(9)}, ${vec[2].toFixed(9)}, ${vec[3].toFixed(9)})`;
  toString_1$6 = toString;
  return toString_1$6;
}
var transform_1$8;
var hasRequiredTransform$8;
function requireTransform$8() {
  if (hasRequiredTransform$8) return transform_1$8;
  hasRequiredTransform$8 = 1;
  const mat42 = requireMat4();
  const vec32 = requireVec3();
  const fromPoints = requireFromPoints$5();
  const flip = requireFlip$1();
  const transform = (out, plane2, matrix) => {
    const ismirror = mat42.isMirroring(matrix);
    const r = vec32.orthogonal(vec32.create(), plane2);
    const u = vec32.cross(r, plane2, r);
    const v = vec32.cross(vec32.create(), plane2, u);
    let point1 = vec32.fromScalar(vec32.create(), plane2[3]);
    vec32.multiply(point1, point1, plane2);
    let point2 = vec32.add(vec32.create(), point1, u);
    let point3 = vec32.add(vec32.create(), point1, v);
    point1 = vec32.transform(point1, point1, matrix);
    point2 = vec32.transform(point2, point2, matrix);
    point3 = vec32.transform(point3, point3, matrix);
    fromPoints(out, point1, point2, point3);
    if (ismirror) {
      flip(out, out);
    }
    return out;
  };
  transform_1$8 = transform;
  return transform_1$8;
}
var plane;
var hasRequiredPlane$1;
function requirePlane$1() {
  if (hasRequiredPlane$1) return plane;
  hasRequiredPlane$1 = 1;
  plane = {
    /**
     * @see [vec4.clone()]{@link module:modeling/maths/vec4.clone}
     * @function clone
     */
    clone: requireClone$4(),
    /**
     * @see [vec4.copy()]{@link module:modeling/maths/vec4.copy}
     * @function copy
     */
    copy: requireCopy$2(),
    /**
     * @see [vec4.create()]{@link module:modeling/maths/vec4.create}
     * @function create
     */
    create: requireCreate$6(),
    /**
     * @see [vec4.equals()]{@link module:modeling/maths/vec4.equals}
     * @function equals
     */
    equals: requireEquals$4(),
    flip: requireFlip$1(),
    fromNormalAndPoint: requireFromNormalAndPoint(),
    /**
     * @see [vec4.fromValues()]{@link module:modeling/maths/vec4.fromValues}
     * @function fromValues
     */
    fromValues: requireFromValues$1(),
    fromNoisyPoints: requireFromNoisyPoints(),
    fromPoints: requireFromPoints$5(),
    fromPointsRandom: requireFromPointsRandom(),
    projectionOfPoint: requireProjectionOfPoint(),
    signedDistanceToPoint: requireSignedDistanceToPoint(),
    /**
     * @see [vec4.toString()]{@link module:modeling/maths/vec4.toString}
     * @function toString
     */
    toString: requireToString$6(),
    transform: requireTransform$8()
  };
  return plane;
}
var invert_1$1;
var hasRequiredInvert$1;
function requireInvert$1() {
  if (hasRequiredInvert$1) return invert_1$1;
  hasRequiredInvert$1 = 1;
  const plane2 = requirePlane$1();
  const create = requireCreate$7();
  const invert = (polygon) => {
    const vertices = polygon.vertices.slice().reverse();
    const inverted = create(vertices);
    if (polygon.plane) {
      inverted.plane = plane2.flip(plane2.create(), polygon.plane);
    }
    return inverted;
  };
  invert_1$1 = invert;
  return invert_1$1;
}
var isA_1$3;
var hasRequiredIsA$3;
function requireIsA$3() {
  if (hasRequiredIsA$3) return isA_1$3;
  hasRequiredIsA$3 = 1;
  const isA = (object) => {
    if (object && typeof object === "object") {
      if ("vertices" in object) {
        if (Array.isArray(object.vertices)) {
          return true;
        }
      }
    }
    return false;
  };
  isA_1$3 = isA;
  return isA_1$3;
}
var isConvex_1$1;
var hasRequiredIsConvex$1;
function requireIsConvex$1() {
  if (hasRequiredIsConvex$1) return isConvex_1$1;
  hasRequiredIsConvex$1 = 1;
  const plane2 = requirePlane$1();
  const vec32 = requireVec3();
  const isConvex = (polygon) => areVerticesConvex(polygon.vertices);
  const areVerticesConvex = (vertices) => {
    const numvertices = vertices.length;
    if (numvertices > 2) {
      const normal = plane2.fromPoints(plane2.create(), ...vertices);
      let prevprevpos = vertices[numvertices - 2];
      let prevpos = vertices[numvertices - 1];
      for (let i = 0; i < numvertices; i++) {
        const pos = vertices[i];
        if (!isConvexPoint(prevprevpos, prevpos, pos, normal)) {
          return false;
        }
        prevprevpos = prevpos;
        prevpos = pos;
      }
    }
    return true;
  };
  const isConvexPoint = (prevpoint, point, nextpoint, normal) => {
    const crossproduct = vec32.cross(
      vec32.create(),
      vec32.subtract(vec32.create(), point, prevpoint),
      vec32.subtract(vec32.create(), nextpoint, point)
    );
    const crossdotnormal = vec32.dot(crossproduct, normal);
    return crossdotnormal >= 0;
  };
  isConvex_1$1 = isConvex;
  return isConvex_1$1;
}
var plane_1;
var hasRequiredPlane;
function requirePlane() {
  if (hasRequiredPlane) return plane_1;
  hasRequiredPlane = 1;
  const mplane = requirePlane$1();
  const plane2 = (polygon) => {
    if (!polygon.plane) {
      polygon.plane = mplane.fromPoints(mplane.create(), ...polygon.vertices);
    }
    return polygon.plane;
  };
  plane_1 = plane2;
  return plane_1;
}
var measureArea_1$2;
var hasRequiredMeasureArea$2;
function requireMeasureArea$2() {
  if (hasRequiredMeasureArea$2) return measureArea_1$2;
  hasRequiredMeasureArea$2 = 1;
  const plane2 = requirePlane();
  const measureArea = (polygon) => {
    const n = polygon.vertices.length;
    if (n < 3) {
      return 0;
    }
    const vertices = polygon.vertices;
    const normal = plane2(polygon);
    const ax = Math.abs(normal[0]);
    const ay = Math.abs(normal[1]);
    const az = Math.abs(normal[2]);
    if (ax + ay + az === 0) {
      return 0;
    }
    let coord = 3;
    if (ax > ay && ax > az) {
      coord = 1;
    } else if (ay > az) {
      coord = 2;
    }
    let area = 0;
    let h = 0;
    let i = 1;
    let j = 2;
    switch (coord) {
      case 1:
        for (i = 1; i < n; i++) {
          h = i - 1;
          j = (i + 1) % n;
          area += vertices[i][1] * (vertices[j][2] - vertices[h][2]);
        }
        area += vertices[0][1] * (vertices[1][2] - vertices[n - 1][2]);
        area /= 2 * normal[0];
        break;
      case 2:
        for (i = 1; i < n; i++) {
          h = i - 1;
          j = (i + 1) % n;
          area += vertices[i][2] * (vertices[j][0] - vertices[h][0]);
        }
        area += vertices[0][2] * (vertices[1][0] - vertices[n - 1][0]);
        area /= 2 * normal[1];
        break;
      case 3:
      // ignore Z coordinates
      default:
        for (i = 1; i < n; i++) {
          h = i - 1;
          j = (i + 1) % n;
          area += vertices[i][0] * (vertices[j][1] - vertices[h][1]);
        }
        area += vertices[0][0] * (vertices[1][1] - vertices[n - 1][1]);
        area /= 2 * normal[2];
        break;
    }
    return area;
  };
  measureArea_1$2 = measureArea;
  return measureArea_1$2;
}
var measureBoundingBox_1$1;
var hasRequiredMeasureBoundingBox$1;
function requireMeasureBoundingBox$1() {
  if (hasRequiredMeasureBoundingBox$1) return measureBoundingBox_1$1;
  hasRequiredMeasureBoundingBox$1 = 1;
  const vec32 = requireVec3();
  const measureBoundingBox = (polygon) => {
    const vertices = polygon.vertices;
    const numvertices = vertices.length;
    const min = numvertices === 0 ? vec32.create() : vec32.clone(vertices[0]);
    const max = vec32.clone(min);
    for (let i = 1; i < numvertices; i++) {
      vec32.min(min, min, vertices[i]);
      vec32.max(max, max, vertices[i]);
    }
    return [min, max];
  };
  measureBoundingBox_1$1 = measureBoundingBox;
  return measureBoundingBox_1$1;
}
var dot_1;
var hasRequiredDot;
function requireDot() {
  if (hasRequiredDot) return dot_1;
  hasRequiredDot = 1;
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  dot_1 = dot;
  return dot_1;
}
var fromScalar_1;
var hasRequiredFromScalar;
function requireFromScalar() {
  if (hasRequiredFromScalar) return fromScalar_1;
  hasRequiredFromScalar = 1;
  const fromScalar = (out, scalar) => {
    out[0] = scalar;
    out[1] = scalar;
    out[2] = scalar;
    out[3] = scalar;
    return out;
  };
  fromScalar_1 = fromScalar;
  return fromScalar_1;
}
var transform_1$7;
var hasRequiredTransform$7;
function requireTransform$7() {
  if (hasRequiredTransform$7) return transform_1$7;
  hasRequiredTransform$7 = 1;
  const transform = (out, vector, matrix) => {
    const [x, y, z, w] = vector;
    out[0] = matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w;
    out[1] = matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w;
    out[2] = matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w;
    out[3] = matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w;
    return out;
  };
  transform_1$7 = transform;
  return transform_1$7;
}
var vec4;
var hasRequiredVec4;
function requireVec4() {
  if (hasRequiredVec4) return vec4;
  hasRequiredVec4 = 1;
  vec4 = {
    clone: requireClone$4(),
    copy: requireCopy$2(),
    create: requireCreate$6(),
    dot: requireDot(),
    equals: requireEquals$4(),
    fromScalar: requireFromScalar(),
    fromValues: requireFromValues$1(),
    toString: requireToString$6(),
    transform: requireTransform$7()
  };
  return vec4;
}
var measureBoundingSphere_1$1;
var hasRequiredMeasureBoundingSphere$1;
function requireMeasureBoundingSphere$1() {
  if (hasRequiredMeasureBoundingSphere$1) return measureBoundingSphere_1$1;
  hasRequiredMeasureBoundingSphere$1 = 1;
  const vec42 = requireVec4();
  const cache2 = /* @__PURE__ */ new WeakMap();
  const measureBoundingSphere = (polygon) => {
    const boundingSphere = cache2.get(polygon);
    if (boundingSphere) return boundingSphere;
    const vertices = polygon.vertices;
    const out = vec42.create();
    if (vertices.length === 0) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      return out;
    }
    let minx = vertices[0];
    let miny = minx;
    let minz = minx;
    let maxx = minx;
    let maxy = minx;
    let maxz = minx;
    vertices.forEach((v) => {
      if (minx[0] > v[0]) minx = v;
      if (miny[1] > v[1]) miny = v;
      if (minz[2] > v[2]) minz = v;
      if (maxx[0] < v[0]) maxx = v;
      if (maxy[1] < v[1]) maxy = v;
      if (maxz[2] < v[2]) maxz = v;
    });
    out[0] = (minx[0] + maxx[0]) * 0.5;
    out[1] = (miny[1] + maxy[1]) * 0.5;
    out[2] = (minz[2] + maxz[2]) * 0.5;
    const x = out[0] - maxx[0];
    const y = out[1] - maxy[1];
    const z = out[2] - maxz[2];
    out[3] = Math.sqrt(x * x + y * y + z * z);
    cache2.set(polygon, out);
    return out;
  };
  measureBoundingSphere_1$1 = measureBoundingSphere;
  return measureBoundingSphere_1$1;
}
var measureSignedVolume_1;
var hasRequiredMeasureSignedVolume;
function requireMeasureSignedVolume() {
  if (hasRequiredMeasureSignedVolume) return measureSignedVolume_1;
  hasRequiredMeasureSignedVolume = 1;
  const vec32 = requireVec3();
  const measureSignedVolume = (polygon) => {
    let signedVolume = 0;
    const vertices = polygon.vertices;
    const cross = vec32.create();
    for (let i = 0; i < vertices.length - 2; i++) {
      vec32.cross(cross, vertices[i + 1], vertices[i + 2]);
      signedVolume += vec32.dot(vertices[0], cross);
    }
    signedVolume /= 6;
    return signedVolume;
  };
  measureSignedVolume_1 = measureSignedVolume;
  return measureSignedVolume_1;
}
var toPoints_1$2;
var hasRequiredToPoints$2;
function requireToPoints$2() {
  if (hasRequiredToPoints$2) return toPoints_1$2;
  hasRequiredToPoints$2 = 1;
  const toPoints = (polygon) => polygon.vertices;
  toPoints_1$2 = toPoints;
  return toPoints_1$2;
}
var toString_1$5;
var hasRequiredToString$5;
function requireToString$5() {
  if (hasRequiredToString$5) return toString_1$5;
  hasRequiredToString$5 = 1;
  const vec32 = requireVec3();
  const toString = (polygon) => {
    let result = "poly3: vertices: [";
    polygon.vertices.forEach((vertex) => {
      result += `${vec32.toString(vertex)}, `;
    });
    result += "]";
    return result;
  };
  toString_1$5 = toString;
  return toString_1$5;
}
var transform_1$6;
var hasRequiredTransform$6;
function requireTransform$6() {
  if (hasRequiredTransform$6) return transform_1$6;
  hasRequiredTransform$6 = 1;
  const mat42 = requireMat4();
  const vec32 = requireVec3();
  const create = requireCreate$7();
  const transform = (matrix, polygon) => {
    const vertices = polygon.vertices.map((vertex) => vec32.transform(vec32.create(), vertex, matrix));
    if (mat42.isMirroring(matrix)) {
      vertices.reverse();
    }
    return create(vertices);
  };
  transform_1$6 = transform;
  return transform_1$6;
}
var validate_1$2;
var hasRequiredValidate$2;
function requireValidate$2() {
  if (hasRequiredValidate$2) return validate_1$2;
  hasRequiredValidate$2 = 1;
  const signedDistanceToPoint = requireSignedDistanceToPoint();
  const { NEPS } = requireConstants();
  const vec32 = requireVec3();
  const isA = requireIsA$3();
  const isConvex = requireIsConvex$1();
  const measureArea = requireMeasureArea$2();
  const plane2 = requirePlane();
  const validate = (object) => {
    if (!isA(object)) {
      throw new Error("invalid poly3 structure");
    }
    if (object.vertices.length < 3) {
      throw new Error(`poly3 not enough vertices ${object.vertices.length}`);
    }
    if (measureArea(object) <= 0) {
      throw new Error("poly3 area must be greater than zero");
    }
    for (let i = 0; i < object.vertices.length; i++) {
      if (vec32.equals(object.vertices[i], object.vertices[(i + 1) % object.vertices.length])) {
        throw new Error(`poly3 duplicate vertex ${object.vertices[i]}`);
      }
    }
    if (!isConvex(object)) {
      throw new Error("poly3 must be convex");
    }
    object.vertices.forEach((vertex) => {
      if (!vertex.every(Number.isFinite)) {
        throw new Error(`poly3 invalid vertex ${vertex}`);
      }
    });
    if (object.vertices.length > 3) {
      const normal = plane2(object);
      object.vertices.forEach((vertex) => {
        const dist = Math.abs(signedDistanceToPoint(normal, vertex));
        if (dist > NEPS) {
          throw new Error(`poly3 must be coplanar: vertex ${vertex} distance ${dist}`);
        }
      });
    }
  };
  validate_1$2 = validate;
  return validate_1$2;
}
var poly3;
var hasRequiredPoly3;
function requirePoly3() {
  if (hasRequiredPoly3) return poly3;
  hasRequiredPoly3 = 1;
  poly3 = {
    clone: requireClone$5(),
    create: requireCreate$7(),
    fromPoints: requireFromPoints$6(),
    fromPointsAndPlane: requireFromPointsAndPlane(),
    invert: requireInvert$1(),
    isA: requireIsA$3(),
    isConvex: requireIsConvex$1(),
    measureArea: requireMeasureArea$2(),
    measureBoundingBox: requireMeasureBoundingBox$1(),
    measureBoundingSphere: requireMeasureBoundingSphere$1(),
    measureSignedVolume: requireMeasureSignedVolume(),
    plane: requirePlane(),
    toPoints: requireToPoints$2(),
    toString: requireToString$5(),
    transform: requireTransform$6(),
    validate: requireValidate$2()
  };
  return poly3;
}
var fromPointsConvex_1;
var hasRequiredFromPointsConvex;
function requireFromPointsConvex() {
  if (hasRequiredFromPointsConvex) return fromPointsConvex_1;
  hasRequiredFromPointsConvex = 1;
  const quickhull2 = requireQuickhull();
  const create = requireCreate$8();
  const poly32 = requirePoly3();
  const fromPointsConvex = (uniquePoints) => {
    if (!Array.isArray(uniquePoints)) {
      throw new Error("the given points must be an array");
    }
    const faces = quickhull2(uniquePoints, { skipTriangulation: true });
    const polygons = faces.map((face) => {
      const vertices = face.map((index) => uniquePoints[index]);
      return poly32.create(vertices);
    });
    return create(polygons);
  };
  fromPointsConvex_1 = fromPointsConvex;
  return fromPointsConvex_1;
}
var fromPoints_1$4;
var hasRequiredFromPoints$4;
function requireFromPoints$4() {
  if (hasRequiredFromPoints$4) return fromPoints_1$4;
  hasRequiredFromPoints$4 = 1;
  const poly32 = requirePoly3();
  const create = requireCreate$8();
  const fromPoints = (listofpoints) => {
    if (!Array.isArray(listofpoints)) {
      throw new Error("the given points must be an array");
    }
    const polygons = listofpoints.map((points, index) => {
      const polygon = poly32.create(points);
      return polygon;
    });
    const result = create(polygons);
    return result;
  };
  fromPoints_1$4 = fromPoints;
  return fromPoints_1$4;
}
var fromCompactBinary_1$1;
var hasRequiredFromCompactBinary$1;
function requireFromCompactBinary$1() {
  if (hasRequiredFromCompactBinary$1) return fromCompactBinary_1$1;
  hasRequiredFromCompactBinary$1 = 1;
  const vec32 = requireVec3();
  const mat42 = requireMat4();
  const poly32 = requirePoly3();
  const create = requireCreate$8();
  const fromCompactBinary = (data) => {
    if (data[0] !== 1) throw new Error("invalid compact binary data");
    const created = create();
    created.transforms = mat42.clone(data.slice(1, 17));
    const numberOfVertices = data[21];
    let ci = 22;
    let vi = data.length - numberOfVertices * 3;
    while (vi < data.length) {
      const verticesPerPolygon = data[ci];
      ci++;
      const vertices = [];
      for (let i = 0; i < verticesPerPolygon; i++) {
        vertices.push(vec32.fromValues(data[vi], data[vi + 1], data[vi + 2]));
        vi += 3;
      }
      created.polygons.push(poly32.create(vertices));
    }
    if (data[17] >= 0) {
      created.color = [data[17], data[18], data[19], data[20]];
    }
    return created;
  };
  fromCompactBinary_1$1 = fromCompactBinary;
  return fromCompactBinary_1$1;
}
var applyTransforms_1$1;
var hasRequiredApplyTransforms$1;
function requireApplyTransforms$1() {
  if (hasRequiredApplyTransforms$1) return applyTransforms_1$1;
  hasRequiredApplyTransforms$1 = 1;
  const mat42 = requireMat4();
  const poly32 = requirePoly3();
  const applyTransforms = (geometry) => {
    if (mat42.isIdentity(geometry.transforms)) return geometry;
    geometry.polygons = geometry.polygons.map((polygon) => poly32.transform(geometry.transforms, polygon));
    geometry.transforms = mat42.create();
    return geometry;
  };
  applyTransforms_1$1 = applyTransforms;
  return applyTransforms_1$1;
}
var toPolygons_1$1;
var hasRequiredToPolygons$1;
function requireToPolygons$1() {
  if (hasRequiredToPolygons$1) return toPolygons_1$1;
  hasRequiredToPolygons$1 = 1;
  const applyTransforms = requireApplyTransforms$1();
  const toPolygons = (geometry) => applyTransforms(geometry).polygons;
  toPolygons_1$1 = toPolygons;
  return toPolygons_1$1;
}
var invert_1;
var hasRequiredInvert;
function requireInvert() {
  if (hasRequiredInvert) return invert_1;
  hasRequiredInvert = 1;
  const poly32 = requirePoly3();
  const create = requireCreate$8();
  const toPolygons = requireToPolygons$1();
  const invert = (geometry) => {
    const polygons = toPolygons(geometry);
    const newpolygons = polygons.map((polygon) => poly32.invert(polygon));
    return create(newpolygons);
  };
  invert_1 = invert;
  return invert_1;
}
var isA_1$2;
var hasRequiredIsA$2;
function requireIsA$2() {
  if (hasRequiredIsA$2) return isA_1$2;
  hasRequiredIsA$2 = 1;
  const isA = (object) => {
    if (object && typeof object === "object") {
      if ("polygons" in object && "transforms" in object) {
        if (Array.isArray(object.polygons) && "length" in object.transforms) {
          return true;
        }
      }
    }
    return false;
  };
  isA_1$2 = isA;
  return isA_1$2;
}
var isConvex_1;
var hasRequiredIsConvex;
function requireIsConvex() {
  if (hasRequiredIsConvex) return isConvex_1;
  hasRequiredIsConvex = 1;
  const { EPS } = requireConstants();
  const vec32 = requireVec3();
  const geom32 = requireIsA$2();
  const toPolygons = requireToPolygons$1();
  const poly32 = requirePoly3();
  const isConvex = (geometry) => {
    if (!geom32(geometry)) {
      throw new Error("isConvex requires a geom3 geometry");
    }
    const polygons = toPolygons(geometry);
    if (polygons.length === 0) {
      return true;
    }
    const vertices = [];
    const found = /* @__PURE__ */ new Set();
    for (let i = 0; i < polygons.length; i++) {
      const verts = polygons[i].vertices;
      for (let j = 0; j < verts.length; j++) {
        const v = verts[j];
        const key = `${v[0]},${v[1]},${v[2]}`;
        if (!found.has(key)) {
          found.add(key);
          vertices.push(v);
        }
      }
    }
    for (let i = 0; i < polygons.length; i++) {
      const plane2 = poly32.plane(polygons[i]);
      for (let j = 0; j < vertices.length; j++) {
        const v = vertices[j];
        const distance = vec32.dot(plane2, v) - plane2[3];
        if (distance > EPS) {
          return false;
        }
      }
    }
    return true;
  };
  isConvex_1 = isConvex;
  return isConvex_1;
}
var toPoints_1$1;
var hasRequiredToPoints$1;
function requireToPoints$1() {
  if (hasRequiredToPoints$1) return toPoints_1$1;
  hasRequiredToPoints$1 = 1;
  const poly32 = requirePoly3();
  const toPolygons = requireToPolygons$1();
  const toPoints = (geometry) => {
    const polygons = toPolygons(geometry);
    const listofpoints = polygons.map((polygon) => poly32.toPoints(polygon));
    return listofpoints;
  };
  toPoints_1$1 = toPoints;
  return toPoints_1$1;
}
var toString_1$4;
var hasRequiredToString$4;
function requireToString$4() {
  if (hasRequiredToString$4) return toString_1$4;
  hasRequiredToString$4 = 1;
  const poly32 = requirePoly3();
  const toPolygons = requireToPolygons$1();
  const toString = (geometry) => {
    const polygons = toPolygons(geometry);
    let result = "geom3 (" + polygons.length + " polygons):\n";
    polygons.forEach((polygon) => {
      result += "  " + poly32.toString(polygon) + "\n";
    });
    return result;
  };
  toString_1$4 = toString;
  return toString_1$4;
}
var toCompactBinary_1$1;
var hasRequiredToCompactBinary$1;
function requireToCompactBinary$1() {
  if (hasRequiredToCompactBinary$1) return toCompactBinary_1$1;
  hasRequiredToCompactBinary$1 = 1;
  const poly32 = requirePoly3();
  const toCompactBinary = (geometry) => {
    const polygons = geometry.polygons;
    const transforms2 = geometry.transforms;
    const numberOfPolygons = polygons.length;
    const numberOfVertices = polygons.reduce((count, polygon) => count + polygon.vertices.length, 0);
    let color = [-1, -1, -1, -1];
    if (geometry.color) color = geometry.color;
    const compacted = new Float32Array(1 + 16 + 4 + 1 + numberOfPolygons + numberOfVertices * 3);
    compacted[0] = 1;
    compacted[1] = transforms2[0];
    compacted[2] = transforms2[1];
    compacted[3] = transforms2[2];
    compacted[4] = transforms2[3];
    compacted[5] = transforms2[4];
    compacted[6] = transforms2[5];
    compacted[7] = transforms2[6];
    compacted[8] = transforms2[7];
    compacted[9] = transforms2[8];
    compacted[10] = transforms2[9];
    compacted[11] = transforms2[10];
    compacted[12] = transforms2[11];
    compacted[13] = transforms2[12];
    compacted[14] = transforms2[13];
    compacted[15] = transforms2[14];
    compacted[16] = transforms2[15];
    compacted[17] = color[0];
    compacted[18] = color[1];
    compacted[19] = color[2];
    compacted[20] = color[3];
    compacted[21] = numberOfVertices;
    let ci = 22;
    let vi = ci + numberOfPolygons;
    polygons.forEach((polygon) => {
      const points = poly32.toPoints(polygon);
      compacted[ci] = points.length;
      ci++;
      for (let i = 0; i < points.length; i++) {
        const point = points[i];
        compacted[vi + 0] = point[0];
        compacted[vi + 1] = point[1];
        compacted[vi + 2] = point[2];
        vi += 3;
      }
    });
    return compacted;
  };
  toCompactBinary_1$1 = toCompactBinary;
  return toCompactBinary_1$1;
}
var transform_1$5;
var hasRequiredTransform$5;
function requireTransform$5() {
  if (hasRequiredTransform$5) return transform_1$5;
  hasRequiredTransform$5 = 1;
  const mat42 = requireMat4();
  const transform = (matrix, geometry) => {
    const transforms2 = mat42.multiply(mat42.create(), matrix, geometry.transforms);
    return Object.assign({}, geometry, { transforms: transforms2 });
  };
  transform_1$5 = transform;
  return transform_1$5;
}
var validate_1$1;
var hasRequiredValidate$1;
function requireValidate$1() {
  if (hasRequiredValidate$1) return validate_1$1;
  hasRequiredValidate$1 = 1;
  const poly32 = requirePoly3();
  const isA = requireIsA$2();
  const validate = (object) => {
    if (!isA(object)) {
      throw new Error("invalid geom3 structure");
    }
    object.polygons.forEach(poly32.validate);
    validateManifold(object);
    if (!object.transforms.every(Number.isFinite)) {
      throw new Error(`geom3 invalid transforms ${object.transforms}`);
    }
  };
  const validateManifold = (object) => {
    const edgeCount = /* @__PURE__ */ new Map();
    object.polygons.forEach(({ vertices }) => {
      vertices.forEach((v, i) => {
        const v1 = `${v}`;
        const v22 = `${vertices[(i + 1) % vertices.length]}`;
        const edge = `${v1}/${v22}`;
        const count = edgeCount.has(edge) ? edgeCount.get(edge) : 0;
        edgeCount.set(edge, count + 1);
      });
    });
    const nonManifold = [];
    edgeCount.forEach((count, edge) => {
      const complementEdge = edge.split("/").reverse().join("/");
      const complementCount = edgeCount.get(complementEdge);
      if (count !== complementCount) {
        nonManifold.push(edge.replace("/", " -> "));
      }
    });
    if (nonManifold.length > 0) {
      throw new Error(`non-manifold edges ${nonManifold.length}
${nonManifold.join("\n")}`);
    }
  };
  validate_1$1 = validate;
  return validate_1$1;
}
var geom3;
var hasRequiredGeom3;
function requireGeom3() {
  if (hasRequiredGeom3) return geom3;
  hasRequiredGeom3 = 1;
  geom3 = {
    clone: requireClone$6(),
    create: requireCreate$8(),
    fromPointsConvex: requireFromPointsConvex(),
    fromPoints: requireFromPoints$4(),
    fromCompactBinary: requireFromCompactBinary$1(),
    invert: requireInvert(),
    isA: requireIsA$2(),
    isConvex: requireIsConvex(),
    toPoints: requireToPoints$1(),
    toPolygons: requireToPolygons$1(),
    toString: requireToString$4(),
    toCompactBinary: requireToCompactBinary$1(),
    transform: requireTransform$5(),
    validate: requireValidate$1()
  };
  return geom3;
}
var clone_1$3;
var hasRequiredClone$3;
function requireClone$3() {
  if (hasRequiredClone$3) return clone_1$3;
  hasRequiredClone$3 = 1;
  const clone = (geometry) => Object.assign({}, geometry);
  clone_1$3 = clone;
  return clone_1$3;
}
var close_1;
var hasRequiredClose;
function requireClose() {
  if (hasRequiredClose) return close_1;
  hasRequiredClose = 1;
  const { EPS } = requireConstants();
  const vec22 = requireVec2();
  const clone = requireClone$3();
  const close = (geometry) => {
    if (geometry.isClosed) return geometry;
    const cloned = clone(geometry);
    cloned.isClosed = true;
    if (cloned.points.length > 1) {
      const points = cloned.points;
      const p0 = points[0];
      let pn = points[points.length - 1];
      while (vec22.distance(p0, pn) < EPS * EPS) {
        points.pop();
        if (points.length === 1) break;
        pn = points[points.length - 1];
      }
    }
    return cloned;
  };
  close_1 = close;
  return close_1;
}
var create_1$5;
var hasRequiredCreate$5;
function requireCreate$5() {
  if (hasRequiredCreate$5) return create_1$5;
  hasRequiredCreate$5 = 1;
  const mat42 = requireMat4();
  const create = (points) => {
    if (points === void 0) {
      points = [];
    }
    return {
      points,
      isClosed: false,
      transforms: mat42.create()
    };
  };
  create_1$5 = create;
  return create_1$5;
}
var fromPoints_1$3;
var hasRequiredFromPoints$3;
function requireFromPoints$3() {
  if (hasRequiredFromPoints$3) return fromPoints_1$3;
  hasRequiredFromPoints$3 = 1;
  const { EPS } = requireConstants();
  const vec22 = requireVec2();
  const close = requireClose();
  const create = requireCreate$5();
  const fromPoints = (options, points) => {
    const defaults = { closed: false };
    let { closed } = Object.assign({}, defaults, options);
    let created = create();
    created.points = points.map((point) => vec22.clone(point));
    if (created.points.length > 1) {
      const p0 = created.points[0];
      const pn = created.points[created.points.length - 1];
      if (vec22.distance(p0, pn) < EPS * EPS) {
        closed = true;
      }
    }
    if (closed === true) created = close(created);
    return created;
  };
  fromPoints_1$3 = fromPoints;
  return fromPoints_1$3;
}
var applyTransforms_1;
var hasRequiredApplyTransforms;
function requireApplyTransforms() {
  if (hasRequiredApplyTransforms) return applyTransforms_1;
  hasRequiredApplyTransforms = 1;
  const mat42 = requireMat4();
  const vec22 = requireVec2();
  const applyTransforms = (geometry) => {
    if (mat42.isIdentity(geometry.transforms)) return geometry;
    geometry.points = geometry.points.map((point) => vec22.transform(vec22.create(), point, geometry.transforms));
    geometry.transforms = mat42.create();
    return geometry;
  };
  applyTransforms_1 = applyTransforms;
  return applyTransforms_1;
}
var toPoints_1;
var hasRequiredToPoints;
function requireToPoints() {
  if (hasRequiredToPoints) return toPoints_1;
  hasRequiredToPoints = 1;
  const applyTransforms = requireApplyTransforms();
  const toPoints = (geometry) => applyTransforms(geometry).points;
  toPoints_1 = toPoints;
  return toPoints_1;
}
var appendArc_1;
var hasRequiredAppendArc;
function requireAppendArc() {
  if (hasRequiredAppendArc) return appendArc_1;
  hasRequiredAppendArc = 1;
  const { TAU } = requireConstants();
  const vec22 = requireVec2();
  const fromPoints = requireFromPoints$3();
  const toPoints = requireToPoints();
  const appendArc = (options, geometry) => {
    const defaults = {
      radius: [0, 0],
      // X and Y radius
      xaxisrotation: 0,
      clockwise: false,
      large: false,
      segments: 16
    };
    let { endpoint, radius: radius2, xaxisrotation, clockwise, large, segments } = Object.assign({}, defaults, options);
    if (!Array.isArray(endpoint)) throw new Error("endpoint must be an array of X and Y values");
    if (endpoint.length < 2) throw new Error("endpoint must contain X and Y values");
    endpoint = vec22.clone(endpoint);
    if (!Array.isArray(radius2)) throw new Error("radius must be an array of X and Y values");
    if (radius2.length < 2) throw new Error("radius must contain X and Y values");
    if (segments < 4) throw new Error("segments must be four or more");
    const decimals = 1e5;
    if (geometry.isClosed) {
      throw new Error("the given path cannot be closed");
    }
    const points = toPoints(geometry);
    if (points.length < 1) {
      throw new Error("the given path must contain one or more points (as the starting point for the arc)");
    }
    let xradius = radius2[0];
    let yradius = radius2[1];
    const startpoint = points[points.length - 1];
    xradius = Math.round(xradius * decimals) / decimals;
    yradius = Math.round(yradius * decimals) / decimals;
    endpoint = vec22.fromValues(Math.round(endpoint[0] * decimals) / decimals, Math.round(endpoint[1] * decimals) / decimals);
    const sweepFlag = !clockwise;
    let newpoints = [];
    if (xradius === 0 || yradius === 0) {
      newpoints.push(endpoint);
    } else {
      xradius = Math.abs(xradius);
      yradius = Math.abs(yradius);
      const phi = xaxisrotation;
      const cosphi = Math.cos(phi);
      const sinphi = Math.sin(phi);
      const minushalfdistance = vec22.subtract(vec22.create(), startpoint, endpoint);
      vec22.scale(minushalfdistance, minushalfdistance, 0.5);
      const x = Math.round((cosphi * minushalfdistance[0] + sinphi * minushalfdistance[1]) * decimals) / decimals;
      const y = Math.round((-sinphi * minushalfdistance[0] + cosphi * minushalfdistance[1]) * decimals) / decimals;
      const startTranslated = vec22.fromValues(x, y);
      const biglambda = startTranslated[0] * startTranslated[0] / (xradius * xradius) + startTranslated[1] * startTranslated[1] / (yradius * yradius);
      if (biglambda > 1) {
        const sqrtbiglambda = Math.sqrt(biglambda);
        xradius *= sqrtbiglambda;
        yradius *= sqrtbiglambda;
        xradius = Math.round(xradius * decimals) / decimals;
        yradius = Math.round(yradius * decimals) / decimals;
      }
      let multiplier1 = Math.sqrt((xradius * xradius * yradius * yradius - xradius * xradius * startTranslated[1] * startTranslated[1] - yradius * yradius * startTranslated[0] * startTranslated[0]) / (xradius * xradius * startTranslated[1] * startTranslated[1] + yradius * yradius * startTranslated[0] * startTranslated[0]));
      if (sweepFlag === large) multiplier1 = -multiplier1;
      const centerTranslated = vec22.fromValues(xradius * startTranslated[1] / yradius, -yradius * startTranslated[0] / xradius);
      vec22.scale(centerTranslated, centerTranslated, multiplier1);
      let center = vec22.fromValues(cosphi * centerTranslated[0] - sinphi * centerTranslated[1], sinphi * centerTranslated[0] + cosphi * centerTranslated[1]);
      center = vec22.add(center, center, vec22.scale(vec22.create(), vec22.add(vec22.create(), startpoint, endpoint), 0.5));
      const vector1 = vec22.fromValues((startTranslated[0] - centerTranslated[0]) / xradius, (startTranslated[1] - centerTranslated[1]) / yradius);
      const vector2 = vec22.fromValues((-startTranslated[0] - centerTranslated[0]) / xradius, (-startTranslated[1] - centerTranslated[1]) / yradius);
      const theta1 = vec22.angleRadians(vector1);
      const theta2 = vec22.angleRadians(vector2);
      let deltatheta = theta2 - theta1;
      deltatheta = deltatheta % TAU;
      if (!sweepFlag && deltatheta > 0) {
        deltatheta -= TAU;
      } else if (sweepFlag && deltatheta < 0) {
        deltatheta += TAU;
      }
      let numsteps = Math.floor(segments * (Math.abs(deltatheta) / TAU));
      if (numsteps < 1) numsteps = 1;
      for (let step = 1; step < numsteps; step++) {
        const theta = theta1 + step / numsteps * deltatheta;
        const costheta = Math.cos(theta);
        const sintheta = Math.sin(theta);
        const point = vec22.fromValues(cosphi * xradius * costheta - sinphi * yradius * sintheta, sinphi * xradius * costheta + cosphi * yradius * sintheta);
        vec22.add(point, point, center);
        newpoints.push(point);
      }
      if (numsteps) newpoints.push(options.endpoint);
    }
    newpoints = points.concat(newpoints);
    const result = fromPoints({}, newpoints);
    return result;
  };
  appendArc_1 = appendArc;
  return appendArc_1;
}
var concat_1;
var hasRequiredConcat;
function requireConcat() {
  if (hasRequiredConcat) return concat_1;
  hasRequiredConcat = 1;
  const fromPoints = requireFromPoints$3();
  const toPoints = requireToPoints();
  const { equals } = requireVec2();
  const concat = (...paths) => {
    let isClosed = false;
    let newpoints = [];
    paths.forEach((path, i) => {
      const tmp = toPoints(path).slice();
      if (newpoints.length > 0 && tmp.length > 0 && equals(tmp[0], newpoints[newpoints.length - 1])) tmp.shift();
      if (tmp.length > 0 && isClosed) {
        throw new Error(`Cannot concatenate to a closed path; check the ${i}th path`);
      }
      isClosed = path.isClosed;
      newpoints = newpoints.concat(tmp);
    });
    return fromPoints({ closed: isClosed }, newpoints);
  };
  concat_1 = concat;
  return concat_1;
}
var appendPoints_1;
var hasRequiredAppendPoints;
function requireAppendPoints() {
  if (hasRequiredAppendPoints) return appendPoints_1;
  hasRequiredAppendPoints = 1;
  const concat = requireConcat();
  const create = requireCreate$5();
  const appendPoints = (points, geometry) => concat(geometry, create(points));
  appendPoints_1 = appendPoints;
  return appendPoints_1;
}
var appendBezier_1;
var hasRequiredAppendBezier;
function requireAppendBezier() {
  if (hasRequiredAppendBezier) return appendBezier_1;
  hasRequiredAppendBezier = 1;
  const { TAU } = requireConstants();
  const vec22 = requireVec2();
  const vec32 = requireVec2();
  const appendPoints = requireAppendPoints();
  const toPoints = requireToPoints();
  const appendBezier = (options, geometry) => {
    const defaults = {
      segments: 16
    };
    let { controlPoints, segments } = Object.assign({}, defaults, options);
    if (!Array.isArray(controlPoints)) throw new Error("controlPoints must be an array of one or more points");
    if (controlPoints.length < 1) throw new Error("controlPoints must be an array of one or more points");
    if (segments < 4) throw new Error("segments must be four or more");
    if (geometry.isClosed) {
      throw new Error("the given geometry cannot be closed");
    }
    const points = toPoints(geometry);
    if (points.length < 1) {
      throw new Error("the given path must contain one or more points (as the starting point for the bezier curve)");
    }
    controlPoints = controlPoints.slice();
    const firstControlPoint = controlPoints[0];
    if (firstControlPoint === null) {
      if (controlPoints.length < 2) {
        throw new Error("a null control point must be passed with one more control points");
      }
      let lastBezierControlPoint = points[points.length - 2];
      if ("lastBezierControlPoint" in geometry) {
        lastBezierControlPoint = geometry.lastBezierControlPoint;
      }
      if (!Array.isArray(lastBezierControlPoint)) {
        throw new Error("the given path must contain TWO or more points if given a null control point");
      }
      const controlpoint = vec22.scale(vec22.create(), points[points.length - 1], 2);
      vec22.subtract(controlpoint, controlpoint, lastBezierControlPoint);
      controlPoints[0] = controlpoint;
    }
    controlPoints.unshift(points[points.length - 1]);
    const bezierOrder = controlPoints.length - 1;
    const factorials = [];
    let fact = 1;
    for (let i = 0; i <= bezierOrder; ++i) {
      if (i > 0) fact *= i;
      factorials.push(fact);
    }
    const binomials = [];
    for (let i = 0; i <= bezierOrder; ++i) {
      const binomial = factorials[bezierOrder] / (factorials[i] * factorials[bezierOrder - i]);
      binomials.push(binomial);
    }
    const v0 = vec22.create();
    const v1 = vec22.create();
    const v32 = vec32.create();
    const getPointForT = (t) => {
      let tk = 1;
      let oneMinusTNMinusK = Math.pow(1 - t, bezierOrder);
      const invOneMinusT = t !== 1 ? 1 / (1 - t) : 1;
      const point = vec22.create();
      for (let k = 0; k <= bezierOrder; ++k) {
        if (k === bezierOrder) oneMinusTNMinusK = 1;
        const bernsteinCoefficient = binomials[k] * tk * oneMinusTNMinusK;
        const derivativePoint = vec22.scale(v0, controlPoints[k], bernsteinCoefficient);
        vec22.add(point, point, derivativePoint);
        tk *= t;
        oneMinusTNMinusK *= invOneMinusT;
      }
      return point;
    };
    const newpoints = [];
    const newpointsT = [];
    const numsteps = bezierOrder + 1;
    for (let i = 0; i < numsteps; ++i) {
      const t = i / (numsteps - 1);
      const point = getPointForT(t);
      newpoints.push(point);
      newpointsT.push(t);
    }
    let subdivideBase = 1;
    const maxangle = TAU / segments;
    const maxsinangle = Math.sin(maxangle);
    while (subdivideBase < newpoints.length - 1) {
      const dir1 = vec22.subtract(v0, newpoints[subdivideBase], newpoints[subdivideBase - 1]);
      vec22.normalize(dir1, dir1);
      const dir2 = vec22.subtract(v1, newpoints[subdivideBase + 1], newpoints[subdivideBase]);
      vec22.normalize(dir2, dir2);
      const sinangle = vec22.cross(v32, dir1, dir2);
      if (Math.abs(sinangle[2]) > maxsinangle) {
        const t0 = newpointsT[subdivideBase - 1];
        const t1 = newpointsT[subdivideBase + 1];
        const newt0 = t0 + (t1 - t0) * 1 / 3;
        const newt1 = t0 + (t1 - t0) * 2 / 3;
        const point0 = getPointForT(newt0);
        const point1 = getPointForT(newt1);
        newpoints.splice(subdivideBase, 1, point0, point1);
        newpointsT.splice(subdivideBase, 1, newt0, newt1);
        subdivideBase--;
        if (subdivideBase < 1) subdivideBase = 1;
      } else {
        ++subdivideBase;
      }
    }
    newpoints.shift();
    const result = appendPoints(newpoints, geometry);
    result.lastBezierControlPoint = controlPoints[controlPoints.length - 2];
    return result;
  };
  appendBezier_1 = appendBezier;
  return appendBezier_1;
}
var equals_1$3;
var hasRequiredEquals$3;
function requireEquals$3() {
  if (hasRequiredEquals$3) return equals_1$3;
  hasRequiredEquals$3 = 1;
  const vec22 = requireVec2();
  const toPoints = requireToPoints();
  const equals = (a, b) => {
    if (a.isClosed !== b.isClosed) {
      return false;
    }
    if (a.points.length !== b.points.length) {
      return false;
    }
    const apoints = toPoints(a);
    const bpoints = toPoints(b);
    const length = apoints.length;
    let offset = 0;
    do {
      let unequal = false;
      for (let i = 0; i < length; i++) {
        if (!vec22.equals(apoints[i], bpoints[(i + offset) % length])) {
          unequal = true;
          break;
        }
      }
      if (unequal === false) {
        return true;
      }
      if (!a.isClosed) {
        return false;
      }
    } while (++offset < length);
    return false;
  };
  equals_1$3 = equals;
  return equals_1$3;
}
var fromCompactBinary_1;
var hasRequiredFromCompactBinary;
function requireFromCompactBinary() {
  if (hasRequiredFromCompactBinary) return fromCompactBinary_1;
  hasRequiredFromCompactBinary = 1;
  const mat42 = requireMat4();
  const vec22 = requireVec2();
  const create = requireCreate$5();
  const fromCompactBinary = (data) => {
    if (data[0] !== 2) throw new Error("invalid compact binary data");
    const created = create();
    created.transforms = mat42.clone(data.slice(1, 17));
    created.isClosed = !!data[17];
    for (let i = 22; i < data.length; i += 2) {
      const point = vec22.fromValues(data[i], data[i + 1]);
      created.points.push(point);
    }
    if (data[18] >= 0) {
      created.color = [data[18], data[19], data[20], data[21]];
    }
    return created;
  };
  fromCompactBinary_1 = fromCompactBinary;
  return fromCompactBinary_1;
}
var isA_1$1;
var hasRequiredIsA$1;
function requireIsA$1() {
  if (hasRequiredIsA$1) return isA_1$1;
  hasRequiredIsA$1 = 1;
  const isA = (object) => {
    if (object && typeof object === "object") {
      if ("points" in object && "transforms" in object && "isClosed" in object) {
        if (Array.isArray(object.points) && "length" in object.transforms) {
          return true;
        }
      }
    }
    return false;
  };
  isA_1$1 = isA;
  return isA_1$1;
}
var reverse_1$3;
var hasRequiredReverse$3;
function requireReverse$3() {
  if (hasRequiredReverse$3) return reverse_1$3;
  hasRequiredReverse$3 = 1;
  const clone = requireClone$3();
  const reverse = (geometry) => {
    const cloned = clone(geometry);
    cloned.points = geometry.points.slice().reverse();
    return cloned;
  };
  reverse_1$3 = reverse;
  return reverse_1$3;
}
var toString_1$3;
var hasRequiredToString$3;
function requireToString$3() {
  if (hasRequiredToString$3) return toString_1$3;
  hasRequiredToString$3 = 1;
  const vec22 = requireVec2();
  const toPoints = requireToPoints();
  const toString = (geometry) => {
    const points = toPoints(geometry);
    let result = "path (" + points.length + " points, " + geometry.isClosed + "):\n[\n";
    points.forEach((point) => {
      result += "  " + vec22.toString(point) + ",\n";
    });
    result += "]\n";
    return result;
  };
  toString_1$3 = toString;
  return toString_1$3;
}
var toCompactBinary_1;
var hasRequiredToCompactBinary;
function requireToCompactBinary() {
  if (hasRequiredToCompactBinary) return toCompactBinary_1;
  hasRequiredToCompactBinary = 1;
  const toCompactBinary = (geometry) => {
    const points = geometry.points;
    const transforms2 = geometry.transforms;
    let color = [-1, -1, -1, -1];
    if (geometry.color) color = geometry.color;
    const compacted = new Float32Array(1 + 16 + 1 + 4 + points.length * 2);
    compacted[0] = 2;
    compacted[1] = transforms2[0];
    compacted[2] = transforms2[1];
    compacted[3] = transforms2[2];
    compacted[4] = transforms2[3];
    compacted[5] = transforms2[4];
    compacted[6] = transforms2[5];
    compacted[7] = transforms2[6];
    compacted[8] = transforms2[7];
    compacted[9] = transforms2[8];
    compacted[10] = transforms2[9];
    compacted[11] = transforms2[10];
    compacted[12] = transforms2[11];
    compacted[13] = transforms2[12];
    compacted[14] = transforms2[13];
    compacted[15] = transforms2[14];
    compacted[16] = transforms2[15];
    compacted[17] = geometry.isClosed ? 1 : 0;
    compacted[18] = color[0];
    compacted[19] = color[1];
    compacted[20] = color[2];
    compacted[21] = color[3];
    for (let j = 0; j < points.length; j++) {
      const ci = j * 2 + 22;
      const point = points[j];
      compacted[ci] = point[0];
      compacted[ci + 1] = point[1];
    }
    return compacted;
  };
  toCompactBinary_1 = toCompactBinary;
  return toCompactBinary_1;
}
var transform_1$4;
var hasRequiredTransform$4;
function requireTransform$4() {
  if (hasRequiredTransform$4) return transform_1$4;
  hasRequiredTransform$4 = 1;
  const mat42 = requireMat4();
  const transform = (matrix, geometry) => {
    const transforms2 = mat42.multiply(mat42.create(), matrix, geometry.transforms);
    return Object.assign({}, geometry, { transforms: transforms2 });
  };
  transform_1$4 = transform;
  return transform_1$4;
}
var validate_1;
var hasRequiredValidate;
function requireValidate() {
  if (hasRequiredValidate) return validate_1;
  hasRequiredValidate = 1;
  const vec22 = requireVec2();
  const isA = requireIsA$1();
  const validate = (object) => {
    if (!isA(object)) {
      throw new Error("invalid path2 structure");
    }
    if (object.points.length > 1) {
      for (let i = 0; i < object.points.length; i++) {
        if (vec22.equals(object.points[i], object.points[(i + 1) % object.points.length])) {
          throw new Error(`path2 duplicate points ${object.points[i]}`);
        }
      }
    }
    object.points.forEach((point) => {
      if (!point.every(Number.isFinite)) {
        throw new Error(`path2 invalid point ${point}`);
      }
    });
    if (!object.transforms.every(Number.isFinite)) {
      throw new Error(`path2 invalid transforms ${object.transforms}`);
    }
  };
  validate_1 = validate;
  return validate_1;
}
var path2;
var hasRequiredPath2;
function requirePath2() {
  if (hasRequiredPath2) return path2;
  hasRequiredPath2 = 1;
  path2 = {
    appendArc: requireAppendArc(),
    appendBezier: requireAppendBezier(),
    appendPoints: requireAppendPoints(),
    clone: requireClone$3(),
    close: requireClose(),
    concat: requireConcat(),
    create: requireCreate$5(),
    equals: requireEquals$3(),
    fromPoints: requireFromPoints$3(),
    fromCompactBinary: requireFromCompactBinary(),
    isA: requireIsA$1(),
    reverse: requireReverse$3(),
    toPoints: requireToPoints(),
    toString: requireToString$3(),
    toCompactBinary: requireToCompactBinary(),
    transform: requireTransform$4(),
    validate: requireValidate()
  };
  return path2;
}
var colorize_1;
var hasRequiredColorize;
function requireColorize() {
  if (hasRequiredColorize) return colorize_1;
  hasRequiredColorize = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const poly32 = requirePoly3();
  const colorGeom2 = (color, object) => {
    const newgeom2 = geom22.clone(object);
    newgeom2.color = color;
    return newgeom2;
  };
  const colorGeom3 = (color, object) => {
    const newgeom3 = geom32.clone(object);
    newgeom3.color = color;
    return newgeom3;
  };
  const colorPath2 = (color, object) => {
    const newpath2 = path22.clone(object);
    newpath2.color = color;
    return newpath2;
  };
  const colorPoly3 = (color, object) => {
    const newpoly = poly32.clone(object);
    newpoly.color = color;
    return newpoly;
  };
  const colorize = (color, ...objects) => {
    if (!Array.isArray(color)) throw new Error("color must be an array");
    if (color.length < 3) throw new Error("color must contain R, G and B values");
    if (color.length === 3) color = [color[0], color[1], color[2], 1];
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (geom22.isA(object)) return colorGeom2(color, object);
      if (geom32.isA(object)) return colorGeom3(color, object);
      if (path22.isA(object)) return colorPath2(color, object);
      if (poly32.isA(object)) return colorPoly3(color, object);
      object.color = color;
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  colorize_1 = colorize;
  return colorize_1;
}
var cssColors_1;
var hasRequiredCssColors;
function requireCssColors() {
  if (hasRequiredCssColors) return cssColors_1;
  hasRequiredCssColors = 1;
  const cssColors = {
    // basic color keywords
    black: [0 / 255, 0 / 255, 0 / 255],
    silver: [192 / 255, 192 / 255, 192 / 255],
    gray: [128 / 255, 128 / 255, 128 / 255],
    white: [255 / 255, 255 / 255, 255 / 255],
    maroon: [128 / 255, 0 / 255, 0 / 255],
    red: [255 / 255, 0 / 255, 0 / 255],
    purple: [128 / 255, 0 / 255, 128 / 255],
    fuchsia: [255 / 255, 0 / 255, 255 / 255],
    green: [0 / 255, 128 / 255, 0 / 255],
    lime: [0 / 255, 255 / 255, 0 / 255],
    olive: [128 / 255, 128 / 255, 0 / 255],
    yellow: [255 / 255, 255 / 255, 0 / 255],
    navy: [0 / 255, 0 / 255, 128 / 255],
    blue: [0 / 255, 0 / 255, 255 / 255],
    teal: [0 / 255, 128 / 255, 128 / 255],
    aqua: [0 / 255, 255 / 255, 255 / 255],
    // extended color keywords
    aliceblue: [240 / 255, 248 / 255, 255 / 255],
    antiquewhite: [250 / 255, 235 / 255, 215 / 255],
    // 'aqua': [ 0 / 255, 255 / 255, 255 / 255 ],
    aquamarine: [127 / 255, 255 / 255, 212 / 255],
    azure: [240 / 255, 255 / 255, 255 / 255],
    beige: [245 / 255, 245 / 255, 220 / 255],
    bisque: [255 / 255, 228 / 255, 196 / 255],
    // 'black': [ 0 / 255, 0 / 255, 0 / 255 ],
    blanchedalmond: [255 / 255, 235 / 255, 205 / 255],
    // 'blue': [ 0 / 255, 0 / 255, 255 / 255 ],
    blueviolet: [138 / 255, 43 / 255, 226 / 255],
    brown: [165 / 255, 42 / 255, 42 / 255],
    burlywood: [222 / 255, 184 / 255, 135 / 255],
    cadetblue: [95 / 255, 158 / 255, 160 / 255],
    chartreuse: [127 / 255, 255 / 255, 0 / 255],
    chocolate: [210 / 255, 105 / 255, 30 / 255],
    coral: [255 / 255, 127 / 255, 80 / 255],
    cornflowerblue: [100 / 255, 149 / 255, 237 / 255],
    cornsilk: [255 / 255, 248 / 255, 220 / 255],
    crimson: [220 / 255, 20 / 255, 60 / 255],
    cyan: [0 / 255, 255 / 255, 255 / 255],
    darkblue: [0 / 255, 0 / 255, 139 / 255],
    darkcyan: [0 / 255, 139 / 255, 139 / 255],
    darkgoldenrod: [184 / 255, 134 / 255, 11 / 255],
    darkgray: [169 / 255, 169 / 255, 169 / 255],
    darkgreen: [0 / 255, 100 / 255, 0 / 255],
    darkgrey: [169 / 255, 169 / 255, 169 / 255],
    darkkhaki: [189 / 255, 183 / 255, 107 / 255],
    darkmagenta: [139 / 255, 0 / 255, 139 / 255],
    darkolivegreen: [85 / 255, 107 / 255, 47 / 255],
    darkorange: [255 / 255, 140 / 255, 0 / 255],
    darkorchid: [153 / 255, 50 / 255, 204 / 255],
    darkred: [139 / 255, 0 / 255, 0 / 255],
    darksalmon: [233 / 255, 150 / 255, 122 / 255],
    darkseagreen: [143 / 255, 188 / 255, 143 / 255],
    darkslateblue: [72 / 255, 61 / 255, 139 / 255],
    darkslategray: [47 / 255, 79 / 255, 79 / 255],
    darkslategrey: [47 / 255, 79 / 255, 79 / 255],
    darkturquoise: [0 / 255, 206 / 255, 209 / 255],
    darkviolet: [148 / 255, 0 / 255, 211 / 255],
    deeppink: [255 / 255, 20 / 255, 147 / 255],
    deepskyblue: [0 / 255, 191 / 255, 255 / 255],
    dimgray: [105 / 255, 105 / 255, 105 / 255],
    dimgrey: [105 / 255, 105 / 255, 105 / 255],
    dodgerblue: [30 / 255, 144 / 255, 255 / 255],
    firebrick: [178 / 255, 34 / 255, 34 / 255],
    floralwhite: [255 / 255, 250 / 255, 240 / 255],
    forestgreen: [34 / 255, 139 / 255, 34 / 255],
    // 'fuchsia': [ 255 / 255, 0 / 255, 255 / 255 ],
    gainsboro: [220 / 255, 220 / 255, 220 / 255],
    ghostwhite: [248 / 255, 248 / 255, 255 / 255],
    gold: [255 / 255, 215 / 255, 0 / 255],
    goldenrod: [218 / 255, 165 / 255, 32 / 255],
    // 'gray': [ 128 / 255, 128 / 255, 128 / 255 ],
    // 'green': [ 0 / 255, 128 / 255, 0 / 255 ],
    greenyellow: [173 / 255, 255 / 255, 47 / 255],
    grey: [128 / 255, 128 / 255, 128 / 255],
    honeydew: [240 / 255, 255 / 255, 240 / 255],
    hotpink: [255 / 255, 105 / 255, 180 / 255],
    indianred: [205 / 255, 92 / 255, 92 / 255],
    indigo: [75 / 255, 0 / 255, 130 / 255],
    ivory: [255 / 255, 255 / 255, 240 / 255],
    khaki: [240 / 255, 230 / 255, 140 / 255],
    lavender: [230 / 255, 230 / 255, 250 / 255],
    lavenderblush: [255 / 255, 240 / 255, 245 / 255],
    lawngreen: [124 / 255, 252 / 255, 0 / 255],
    lemonchiffon: [255 / 255, 250 / 255, 205 / 255],
    lightblue: [173 / 255, 216 / 255, 230 / 255],
    lightcoral: [240 / 255, 128 / 255, 128 / 255],
    lightcyan: [224 / 255, 255 / 255, 255 / 255],
    lightgoldenrodyellow: [250 / 255, 250 / 255, 210 / 255],
    lightgray: [211 / 255, 211 / 255, 211 / 255],
    lightgreen: [144 / 255, 238 / 255, 144 / 255],
    lightgrey: [211 / 255, 211 / 255, 211 / 255],
    lightpink: [255 / 255, 182 / 255, 193 / 255],
    lightsalmon: [255 / 255, 160 / 255, 122 / 255],
    lightseagreen: [32 / 255, 178 / 255, 170 / 255],
    lightskyblue: [135 / 255, 206 / 255, 250 / 255],
    lightslategray: [119 / 255, 136 / 255, 153 / 255],
    lightslategrey: [119 / 255, 136 / 255, 153 / 255],
    lightsteelblue: [176 / 255, 196 / 255, 222 / 255],
    lightyellow: [255 / 255, 255 / 255, 224 / 255],
    // 'lime': [ 0 / 255, 255 / 255, 0 / 255 ],
    limegreen: [50 / 255, 205 / 255, 50 / 255],
    linen: [250 / 255, 240 / 255, 230 / 255],
    magenta: [255 / 255, 0 / 255, 255 / 255],
    // 'maroon': [ 128 / 255, 0 / 255, 0 / 255 ],
    mediumaquamarine: [102 / 255, 205 / 255, 170 / 255],
    mediumblue: [0 / 255, 0 / 255, 205 / 255],
    mediumorchid: [186 / 255, 85 / 255, 211 / 255],
    mediumpurple: [147 / 255, 112 / 255, 219 / 255],
    mediumseagreen: [60 / 255, 179 / 255, 113 / 255],
    mediumslateblue: [123 / 255, 104 / 255, 238 / 255],
    mediumspringgreen: [0 / 255, 250 / 255, 154 / 255],
    mediumturquoise: [72 / 255, 209 / 255, 204 / 255],
    mediumvioletred: [199 / 255, 21 / 255, 133 / 255],
    midnightblue: [25 / 255, 25 / 255, 112 / 255],
    mintcream: [245 / 255, 255 / 255, 250 / 255],
    mistyrose: [255 / 255, 228 / 255, 225 / 255],
    moccasin: [255 / 255, 228 / 255, 181 / 255],
    navajowhite: [255 / 255, 222 / 255, 173 / 255],
    // 'navy': [ 0 / 255, 0 / 255, 128 / 255 ],
    oldlace: [253 / 255, 245 / 255, 230 / 255],
    // 'olive': [ 128 / 255, 128 / 255, 0 / 255 ],
    olivedrab: [107 / 255, 142 / 255, 35 / 255],
    orange: [255 / 255, 165 / 255, 0 / 255],
    orangered: [255 / 255, 69 / 255, 0 / 255],
    orchid: [218 / 255, 112 / 255, 214 / 255],
    palegoldenrod: [238 / 255, 232 / 255, 170 / 255],
    palegreen: [152 / 255, 251 / 255, 152 / 255],
    paleturquoise: [175 / 255, 238 / 255, 238 / 255],
    palevioletred: [219 / 255, 112 / 255, 147 / 255],
    papayawhip: [255 / 255, 239 / 255, 213 / 255],
    peachpuff: [255 / 255, 218 / 255, 185 / 255],
    peru: [205 / 255, 133 / 255, 63 / 255],
    pink: [255 / 255, 192 / 255, 203 / 255],
    plum: [221 / 255, 160 / 255, 221 / 255],
    powderblue: [176 / 255, 224 / 255, 230 / 255],
    // 'purple': [ 128 / 255, 0 / 255, 128 / 255 ],
    // 'red': [ 255 / 255, 0 / 255, 0 / 255 ],
    rosybrown: [188 / 255, 143 / 255, 143 / 255],
    royalblue: [65 / 255, 105 / 255, 225 / 255],
    saddlebrown: [139 / 255, 69 / 255, 19 / 255],
    salmon: [250 / 255, 128 / 255, 114 / 255],
    sandybrown: [244 / 255, 164 / 255, 96 / 255],
    seagreen: [46 / 255, 139 / 255, 87 / 255],
    seashell: [255 / 255, 245 / 255, 238 / 255],
    sienna: [160 / 255, 82 / 255, 45 / 255],
    // 'silver': [ 192 / 255, 192 / 255, 192 / 255 ],
    skyblue: [135 / 255, 206 / 255, 235 / 255],
    slateblue: [106 / 255, 90 / 255, 205 / 255],
    slategray: [112 / 255, 128 / 255, 144 / 255],
    slategrey: [112 / 255, 128 / 255, 144 / 255],
    snow: [255 / 255, 250 / 255, 250 / 255],
    springgreen: [0 / 255, 255 / 255, 127 / 255],
    steelblue: [70 / 255, 130 / 255, 180 / 255],
    tan: [210 / 255, 180 / 255, 140 / 255],
    // 'teal': [ 0 / 255, 128 / 255, 128 / 255 ],
    thistle: [216 / 255, 191 / 255, 216 / 255],
    tomato: [255 / 255, 99 / 255, 71 / 255],
    turquoise: [64 / 255, 224 / 255, 208 / 255],
    violet: [238 / 255, 130 / 255, 238 / 255],
    wheat: [245 / 255, 222 / 255, 179 / 255],
    // 'white': [ 255 / 255, 255 / 255, 255 / 255 ],
    whitesmoke: [245 / 255, 245 / 255, 245 / 255],
    // 'yellow': [ 255 / 255, 255 / 255, 0 / 255 ],
    yellowgreen: [154 / 255, 205 / 255, 50 / 255]
  };
  cssColors_1 = cssColors;
  return cssColors_1;
}
var colorNameToRgb_1;
var hasRequiredColorNameToRgb;
function requireColorNameToRgb() {
  if (hasRequiredColorNameToRgb) return colorNameToRgb_1;
  hasRequiredColorNameToRgb = 1;
  const cssColors = requireCssColors();
  const colorNameToRgb = (s) => cssColors[s.toLowerCase()];
  colorNameToRgb_1 = colorNameToRgb;
  return colorNameToRgb_1;
}
var hexToRgb_1;
var hasRequiredHexToRgb;
function requireHexToRgb() {
  if (hasRequiredHexToRgb) return hexToRgb_1;
  hasRequiredHexToRgb = 1;
  const hexToRgb = (notation) => {
    notation = notation.replace("#", "");
    if (notation.length < 6) throw new Error("the given notation must contain 3 or more hex values");
    const r = parseInt(notation.substring(0, 2), 16) / 255;
    const g = parseInt(notation.substring(2, 4), 16) / 255;
    const b = parseInt(notation.substring(4, 6), 16) / 255;
    if (notation.length >= 8) {
      const a = parseInt(notation.substring(6, 8), 16) / 255;
      return [r, g, b, a];
    }
    return [r, g, b];
  };
  hexToRgb_1 = hexToRgb;
  return hexToRgb_1;
}
var hueToColorComponent_1;
var hasRequiredHueToColorComponent;
function requireHueToColorComponent() {
  if (hasRequiredHueToColorComponent) return hueToColorComponent_1;
  hasRequiredHueToColorComponent = 1;
  const hueToColorComponent = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  hueToColorComponent_1 = hueToColorComponent;
  return hueToColorComponent_1;
}
var hslToRgb_1;
var hasRequiredHslToRgb;
function requireHslToRgb() {
  if (hasRequiredHslToRgb) return hslToRgb_1;
  hasRequiredHslToRgb = 1;
  const flatten = requireFlatten();
  const hueToColorComponent = requireHueToColorComponent();
  const hslToRgb = (...values) => {
    values = flatten(values);
    if (values.length < 3) throw new Error("values must contain H, S and L values");
    const h = values[0];
    const s = values[1];
    const l = values[2];
    let r = l;
    let g = l;
    let b = l;
    if (s !== 0) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hueToColorComponent(p, q, h + 1 / 3);
      g = hueToColorComponent(p, q, h);
      b = hueToColorComponent(p, q, h - 1 / 3);
    }
    if (values.length > 3) {
      const a = values[3];
      return [r, g, b, a];
    }
    return [r, g, b];
  };
  hslToRgb_1 = hslToRgb;
  return hslToRgb_1;
}
var hsvToRgb_1;
var hasRequiredHsvToRgb;
function requireHsvToRgb() {
  if (hasRequiredHsvToRgb) return hsvToRgb_1;
  hasRequiredHsvToRgb = 1;
  const flatten = requireFlatten();
  const hsvToRgb = (...values) => {
    values = flatten(values);
    if (values.length < 3) throw new Error("values must contain H, S and V values");
    const h = values[0];
    const s = values[1];
    const v = values[2];
    let r = 0;
    let g = 0;
    let b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
    }
    if (values.length > 3) {
      const a = values[3];
      return [r, g, b, a];
    }
    return [r, g, b];
  };
  hsvToRgb_1 = hsvToRgb;
  return hsvToRgb_1;
}
var rgbToHex_1;
var hasRequiredRgbToHex;
function requireRgbToHex() {
  if (hasRequiredRgbToHex) return rgbToHex_1;
  hasRequiredRgbToHex = 1;
  const flatten = requireFlatten();
  const rgbToHex = (...values) => {
    values = flatten(values);
    if (values.length < 3) throw new Error("values must contain R, G and B values");
    const r = values[0] * 255;
    const g = values[1] * 255;
    const b = values[2] * 255;
    let s = `#${Number(16777216 + r * 65536 + g * 256 + b).toString(16).substring(1, 7)}`;
    if (values.length > 3) {
      s = s + Number(values[3] * 255).toString(16);
    }
    return s;
  };
  rgbToHex_1 = rgbToHex;
  return rgbToHex_1;
}
var rgbToHsl_1;
var hasRequiredRgbToHsl;
function requireRgbToHsl() {
  if (hasRequiredRgbToHsl) return rgbToHsl_1;
  hasRequiredRgbToHsl = 1;
  const flatten = requireFlatten();
  const rgbToHsl = (...values) => {
    values = flatten(values);
    if (values.length < 3) throw new Error("values must contain R, G and B values");
    const r = values[0];
    const g = values[1];
    const b = values[2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    let s;
    const l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    if (values.length > 3) {
      const a = values[3];
      return [h, s, l, a];
    }
    return [h, s, l];
  };
  rgbToHsl_1 = rgbToHsl;
  return rgbToHsl_1;
}
var rgbToHsv_1;
var hasRequiredRgbToHsv;
function requireRgbToHsv() {
  if (hasRequiredRgbToHsv) return rgbToHsv_1;
  hasRequiredRgbToHsv = 1;
  const flatten = requireFlatten();
  const rgbToHsv = (...values) => {
    values = flatten(values);
    if (values.length < 3) throw new Error("values must contain R, G and B values");
    const r = values[0];
    const g = values[1];
    const b = values[2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    if (values.length > 3) {
      const a = values[3];
      return [h, s, v, a];
    }
    return [h, s, v];
  };
  rgbToHsv_1 = rgbToHsv;
  return rgbToHsv_1;
}
var colors;
var hasRequiredColors;
function requireColors() {
  if (hasRequiredColors) return colors;
  hasRequiredColors = 1;
  colors = {
    colorize: requireColorize(),
    colorNameToRgb: requireColorNameToRgb(),
    cssColors: requireCssColors(),
    hexToRgb: requireHexToRgb(),
    hslToRgb: requireHslToRgb(),
    hsvToRgb: requireHsvToRgb(),
    hueToColorComponent: requireHueToColorComponent(),
    rgbToHex: requireRgbToHex(),
    rgbToHsl: requireRgbToHsl(),
    rgbToHsv: requireRgbToHsv()
  };
  return colors;
}
var create_1$4;
var hasRequiredCreate$4;
function requireCreate$4() {
  if (hasRequiredCreate$4) return create_1$4;
  hasRequiredCreate$4 = 1;
  const create = (points) => {
    if (!Array.isArray(points)) throw new Error("Bezier points must be a valid array/");
    if (points.length < 2) throw new Error("Bezier points must contain at least 2 values.");
    const pointType = getPointType(points);
    return {
      points,
      pointType,
      dimensions: pointType === "float_single" ? 0 : points[0].length,
      permutations: getPermutations(points.length - 1),
      tangentPermutations: getPermutations(points.length - 2)
    };
  };
  const getPointType = function(points) {
    let firstPointType = null;
    points.forEach((point) => {
      let pType = "";
      if (Number.isFinite(point)) {
        pType = "float_single";
      } else if (Array.isArray(point)) {
        point.forEach((val) => {
          if (!Number.isFinite(val)) throw new Error("Bezier point values must all be numbers.");
        });
        pType = "float_" + point.length;
      } else throw new Error("Bezier points must all be numbers or arrays of number.");
      if (firstPointType == null) {
        firstPointType = pType;
      } else {
        if (firstPointType !== pType) {
          throw new Error("Bezier points must be either all numbers or all arrays of numbers of the same size.");
        }
      }
    });
    return firstPointType;
  };
  const getPermutations = function(c) {
    const permutations = [];
    for (let i = 0; i <= c; i++) {
      permutations.push(factorial(c) / (factorial(i) * factorial(c - i)));
    }
    return permutations;
  };
  const factorial = function(b) {
    let out = 1;
    for (let i = 2; i <= b; i++) {
      out *= i;
    }
    return out;
  };
  create_1$4 = create;
  return create_1$4;
}
var valueAt_1;
var hasRequiredValueAt;
function requireValueAt() {
  if (hasRequiredValueAt) return valueAt_1;
  hasRequiredValueAt = 1;
  const valueAt = (t, bezier2) => {
    if (t < 0 || t > 1) {
      throw new Error("Bezier valueAt() input must be between 0 and 1");
    }
    if (bezier2.pointType === "float_single") {
      return bezierFunction(bezier2, bezier2.points, t);
    } else {
      const result = [];
      for (let i = 0; i < bezier2.dimensions; i++) {
        const singleDimensionPoints = [];
        for (let j = 0; j < bezier2.points.length; j++) {
          singleDimensionPoints.push(bezier2.points[j][i]);
        }
        result.push(bezierFunction(bezier2, singleDimensionPoints, t));
      }
      return result;
    }
  };
  const bezierFunction = function(bezier2, p, t) {
    const n = p.length - 1;
    let result = 0;
    for (let i = 0; i <= n; i++) {
      result += bezier2.permutations[i] * Math.pow(1 - t, n - i) * Math.pow(t, i) * p[i];
    }
    return result;
  };
  valueAt_1 = valueAt;
  return valueAt_1;
}
var tangentAt_1;
var hasRequiredTangentAt;
function requireTangentAt() {
  if (hasRequiredTangentAt) return tangentAt_1;
  hasRequiredTangentAt = 1;
  const tangentAt = (t, bezier2) => {
    if (t < 0 || t > 1) {
      throw new Error("Bezier tangentAt() input must be between 0 and 1");
    }
    if (bezier2.pointType === "float_single") {
      return bezierTangent(bezier2, bezier2.points, t);
    } else {
      const result = [];
      for (let i = 0; i < bezier2.dimensions; i++) {
        const singleDimensionPoints = [];
        for (let j = 0; j < bezier2.points.length; j++) {
          singleDimensionPoints.push(bezier2.points[j][i]);
        }
        result.push(bezierTangent(bezier2, singleDimensionPoints, t));
      }
      return result;
    }
  };
  const bezierTangent = function(bezier2, p, t) {
    const n = p.length - 1;
    let result = 0;
    for (let i = 0; i < n; i++) {
      const q = n * (p[i + 1] - p[i]);
      result += bezier2.tangentPermutations[i] * Math.pow(1 - t, n - 1 - i) * Math.pow(t, i) * q;
    }
    return result;
  };
  tangentAt_1 = tangentAt;
  return tangentAt_1;
}
var lengths_1;
var hasRequiredLengths;
function requireLengths() {
  if (hasRequiredLengths) return lengths_1;
  hasRequiredLengths = 1;
  const valueAt = requireValueAt();
  const lengths = (segments, bezier2) => {
    let sum = 0;
    const lengths2 = [0];
    let previous = valueAt(0, bezier2);
    for (let index = 1; index <= segments; index++) {
      const current = valueAt(index / segments, bezier2);
      sum += distanceBetween(current, previous);
      lengths2.push(sum);
      previous = current;
    }
    return lengths2;
  };
  const distanceBetween = (a, b) => {
    if (Number.isFinite(a) && Number.isFinite(b)) {
      return Math.abs(a - b);
    } else if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        throw new Error("The operands must have the same number of dimensions.");
      }
      let sum = 0;
      for (let i = 0; i < a.length; i++) {
        sum += (b[i] - a[i]) * (b[i] - a[i]);
      }
      return Math.sqrt(sum);
    } else {
      throw new Error("The operands must be of the same type, either number or array.");
    }
  };
  lengths_1 = lengths;
  return lengths_1;
}
var length_1;
var hasRequiredLength;
function requireLength() {
  if (hasRequiredLength) return length_1;
  hasRequiredLength = 1;
  const lengths = requireLengths();
  const length = (segments, bezier2) => lengths(segments, bezier2)[segments];
  length_1 = length;
  return length_1;
}
var arcLengthToT_1;
var hasRequiredArcLengthToT;
function requireArcLengthToT() {
  if (hasRequiredArcLengthToT) return arcLengthToT_1;
  hasRequiredArcLengthToT = 1;
  const lengths = requireLengths();
  const arcLengthToT = (options, bezier2) => {
    const defaults = {
      distance: 0,
      segments: 100
    };
    const { distance, segments } = Object.assign({}, defaults, options);
    const arcLengths = lengths(segments, bezier2);
    let startIndex = 0;
    let endIndex = segments;
    while (startIndex <= endIndex) {
      const middleIndex = Math.floor(startIndex + (endIndex - startIndex) / 2);
      const diff = arcLengths[middleIndex] - distance;
      if (diff < 0) {
        startIndex = middleIndex + 1;
      } else if (diff > 0) {
        endIndex = middleIndex - 1;
      } else {
        endIndex = middleIndex;
        break;
      }
    }
    const targetIndex = endIndex;
    if (arcLengths[targetIndex] === distance) {
      return targetIndex / segments;
    }
    const lengthBefore = arcLengths[targetIndex];
    const lengthAfter = arcLengths[targetIndex + 1];
    const segmentLength = lengthAfter - lengthBefore;
    const segmentFraction = (distance - lengthBefore) / segmentLength;
    return (targetIndex + segmentFraction) / segments;
  };
  arcLengthToT_1 = arcLengthToT;
  return arcLengthToT_1;
}
var bezier;
var hasRequiredBezier;
function requireBezier() {
  if (hasRequiredBezier) return bezier;
  hasRequiredBezier = 1;
  bezier = {
    create: requireCreate$4(),
    valueAt: requireValueAt(),
    tangentAt: requireTangentAt(),
    lengths: requireLengths(),
    length: requireLength(),
    arcLengthToT: requireArcLengthToT()
  };
  return bezier;
}
var curves;
var hasRequiredCurves;
function requireCurves() {
  if (hasRequiredCurves) return curves;
  hasRequiredCurves = 1;
  curves = {
    bezier: requireBezier()
  };
  return curves;
}
var area_1;
var hasRequiredArea;
function requireArea() {
  if (hasRequiredArea) return area_1;
  hasRequiredArea = 1;
  const area = (points) => {
    let area2 = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area2 += points[i][0] * points[j][1];
      area2 -= points[j][0] * points[i][1];
    }
    return area2 / 2;
  };
  area_1 = area;
  return area_1;
}
var measureArea_1$1;
var hasRequiredMeasureArea$1;
function requireMeasureArea$1() {
  if (hasRequiredMeasureArea$1) return measureArea_1$1;
  hasRequiredMeasureArea$1 = 1;
  const area = requireArea();
  const measureArea = (polygon) => area(polygon.vertices);
  measureArea_1$1 = measureArea;
  return measureArea_1$1;
}
var create_1$3;
var hasRequiredCreate$3;
function requireCreate$3() {
  if (hasRequiredCreate$3) return create_1$3;
  hasRequiredCreate$3 = 1;
  const create = (vertices) => {
    if (vertices === void 0 || vertices.length < 3) {
      vertices = [];
    }
    return { vertices };
  };
  create_1$3 = create;
  return create_1$3;
}
var flip_1;
var hasRequiredFlip;
function requireFlip() {
  if (hasRequiredFlip) return flip_1;
  hasRequiredFlip = 1;
  const create = requireCreate$3();
  const flip = (polygon) => {
    const vertices = polygon.vertices.slice().reverse();
    return create(vertices);
  };
  flip_1 = flip;
  return flip_1;
}
var arePointsInside_1;
var hasRequiredArePointsInside;
function requireArePointsInside() {
  if (hasRequiredArePointsInside) return arePointsInside_1;
  hasRequiredArePointsInside = 1;
  const measureArea = requireMeasureArea$1();
  const flip = requireFlip();
  const arePointsInside = (points, polygon) => {
    if (points.length === 0) return 0;
    const vertices = polygon.vertices;
    if (vertices.length < 3) return 0;
    if (measureArea(polygon) < 0) {
      polygon = flip(polygon);
    }
    const sum = points.reduce((acc, point) => acc + isPointInside(point, vertices), 0);
    return sum === points.length ? 1 : 0;
  };
  const isPointInside = (point, polygon) => {
    const numverts = polygon.length;
    const tx = point[0];
    const ty = point[1];
    let vtx0 = polygon[numverts - 1];
    let vtx1 = polygon[0];
    let yflag0 = vtx0[1] > ty;
    let insideFlag = 0;
    let i = 0;
    for (let j = numverts + 1; --j; ) {
      const yflag1 = vtx1[1] > ty;
      if (yflag0 !== yflag1) {
        const xflag0 = vtx0[0] > tx;
        const xflag1 = vtx1[0] > tx;
        if (xflag0 && xflag1) {
          insideFlag = !insideFlag;
        } else {
          if (vtx1[0] - (vtx1[1] - ty) * (vtx0[0] - vtx1[0]) / (vtx0[1] - vtx1[1]) >= tx) {
            insideFlag = !insideFlag;
          }
        }
      }
      yflag0 = yflag1;
      vtx0 = vtx1;
      vtx1 = polygon[++i];
    }
    return insideFlag;
  };
  arePointsInside_1 = arePointsInside;
  return arePointsInside_1;
}
var poly2;
var hasRequiredPoly2;
function requirePoly2() {
  if (hasRequiredPoly2) return poly2;
  hasRequiredPoly2 = 1;
  poly2 = {
    arePointsInside: requireArePointsInside(),
    create: requireCreate$3(),
    flip: requireFlip(),
    measureArea: requireMeasureArea$1()
  };
  return poly2;
}
var geometries;
var hasRequiredGeometries;
function requireGeometries() {
  if (hasRequiredGeometries) return geometries;
  hasRequiredGeometries = 1;
  geometries = {
    geom2: requireGeom2(),
    geom3: requireGeom3(),
    path2: requirePath2(),
    poly2: requirePoly2(),
    poly3: requirePoly3()
  };
  return geometries;
}
var create_1$2;
var hasRequiredCreate$2;
function requireCreate$2() {
  if (hasRequiredCreate$2) return create_1$2;
  hasRequiredCreate$2 = 1;
  const create = () => [0, 1, 0];
  create_1$2 = create;
  return create_1$2;
}
var clone_1$2;
var hasRequiredClone$2;
function requireClone$2() {
  if (hasRequiredClone$2) return clone_1$2;
  hasRequiredClone$2 = 1;
  const create = requireCreate$2();
  const clone = (line) => {
    const out = create();
    out[0] = line[0];
    out[1] = line[1];
    out[2] = line[2];
    return out;
  };
  clone_1$2 = clone;
  return clone_1$2;
}
var direction_1$1;
var hasRequiredDirection$1;
function requireDirection$1() {
  if (hasRequiredDirection$1) return direction_1$1;
  hasRequiredDirection$1 = 1;
  const vec22 = requireVec2();
  const direction = (line) => {
    const vector = vec22.normal(vec22.create(), line);
    vec22.negate(vector, vector);
    return vector;
  };
  direction_1$1 = direction;
  return direction_1$1;
}
var origin_1$1;
var hasRequiredOrigin$1;
function requireOrigin$1() {
  if (hasRequiredOrigin$1) return origin_1$1;
  hasRequiredOrigin$1 = 1;
  const vec22 = requireVec2();
  const origin = (line) => vec22.scale(vec22.create(), line, line[2]);
  origin_1$1 = origin;
  return origin_1$1;
}
var closestPoint_1$1;
var hasRequiredClosestPoint$1;
function requireClosestPoint$1() {
  if (hasRequiredClosestPoint$1) return closestPoint_1$1;
  hasRequiredClosestPoint$1 = 1;
  const vec22 = requireVec2();
  const direction = requireDirection$1();
  const origin = requireOrigin$1();
  const closestPoint = (line, point) => {
    const orig = origin(line);
    const dir = direction(line);
    const v = vec22.subtract(vec22.create(), point, orig);
    const dist = vec22.dot(v, dir);
    vec22.scale(v, dir, dist);
    vec22.add(v, v, orig);
    return v;
  };
  closestPoint_1$1 = closestPoint;
  return closestPoint_1$1;
}
var copy_1$1;
var hasRequiredCopy$1;
function requireCopy$1() {
  if (hasRequiredCopy$1) return copy_1$1;
  hasRequiredCopy$1 = 1;
  const copy = (out, line) => {
    out[0] = line[0];
    out[1] = line[1];
    out[2] = line[2];
    return out;
  };
  copy_1$1 = copy;
  return copy_1$1;
}
var distanceToPoint_1$1;
var hasRequiredDistanceToPoint$1;
function requireDistanceToPoint$1() {
  if (hasRequiredDistanceToPoint$1) return distanceToPoint_1$1;
  hasRequiredDistanceToPoint$1 = 1;
  const vec22 = requireVec2();
  const distanceToPoint = (line, point) => {
    let distance = vec22.dot(point, line);
    distance = Math.abs(distance - line[2]);
    return distance;
  };
  distanceToPoint_1$1 = distanceToPoint;
  return distanceToPoint_1$1;
}
var equals_1$2;
var hasRequiredEquals$2;
function requireEquals$2() {
  if (hasRequiredEquals$2) return equals_1$2;
  hasRequiredEquals$2 = 1;
  const equals = (line1, line22) => line1[0] === line22[0] && (line1[1] === line22[1] && line1[2] === line22[2]);
  equals_1$2 = equals;
  return equals_1$2;
}
var fromPoints_1$2;
var hasRequiredFromPoints$2;
function requireFromPoints$2() {
  if (hasRequiredFromPoints$2) return fromPoints_1$2;
  hasRequiredFromPoints$2 = 1;
  const vec22 = requireVec2();
  const fromPoints = (out, point1, point2) => {
    const vector = vec22.subtract(vec22.create(), point2, point1);
    vec22.normal(vector, vector);
    vec22.normalize(vector, vector);
    const distance = vec22.dot(point1, vector);
    out[0] = vector[0];
    out[1] = vector[1];
    out[2] = distance;
    return out;
  };
  fromPoints_1$2 = fromPoints;
  return fromPoints_1$2;
}
var fromValues_1;
var hasRequiredFromValues;
function requireFromValues() {
  if (hasRequiredFromValues) return fromValues_1;
  hasRequiredFromValues = 1;
  const create = requireCreate$2();
  const fromValues = (x, y, d) => {
    const out = create();
    out[0] = x;
    out[1] = y;
    out[2] = d;
    return out;
  };
  fromValues_1 = fromValues;
  return fromValues_1;
}
var aboutEqualNormals_1;
var hasRequiredAboutEqualNormals;
function requireAboutEqualNormals() {
  if (hasRequiredAboutEqualNormals) return aboutEqualNormals_1;
  hasRequiredAboutEqualNormals = 1;
  const { NEPS } = requireConstants();
  const aboutEqualNormals = (a, b) => Math.abs(a[0] - b[0]) <= NEPS && Math.abs(a[1] - b[1]) <= NEPS && Math.abs(a[2] - b[2]) <= NEPS;
  aboutEqualNormals_1 = aboutEqualNormals;
  return aboutEqualNormals_1;
}
var interpolateBetween2DPointsForY_1;
var hasRequiredInterpolateBetween2DPointsForY;
function requireInterpolateBetween2DPointsForY() {
  if (hasRequiredInterpolateBetween2DPointsForY) return interpolateBetween2DPointsForY_1;
  hasRequiredInterpolateBetween2DPointsForY = 1;
  const interpolateBetween2DPointsForY = (point1, point2, y) => {
    let f1 = y - point1[1];
    let f2 = point2[1] - point1[1];
    if (f2 < 0) {
      f1 = -f1;
      f2 = -f2;
    }
    let t;
    if (f1 <= 0) {
      t = 0;
    } else if (f1 >= f2) {
      t = 1;
    } else if (f2 < 1e-10) {
      t = 0.5;
    } else {
      t = f1 / f2;
    }
    const result = point1[0] + t * (point2[0] - point1[0]);
    return result;
  };
  interpolateBetween2DPointsForY_1 = interpolateBetween2DPointsForY;
  return interpolateBetween2DPointsForY_1;
}
var intersect_1$1;
var hasRequiredIntersect$1;
function requireIntersect$1() {
  if (hasRequiredIntersect$1) return intersect_1$1;
  hasRequiredIntersect$1 = 1;
  const intersect = (p1, p2, p3, p4) => {
    if (p1[0] === p2[0] && p1[1] === p2[1] || p3[0] === p4[0] && p3[1] === p4[1]) {
      return void 0;
    }
    const denominator = (p4[1] - p3[1]) * (p2[0] - p1[0]) - (p4[0] - p3[0]) * (p2[1] - p1[1]);
    if (Math.abs(denominator) < Number.MIN_VALUE) {
      return void 0;
    }
    const ua = ((p4[0] - p3[0]) * (p1[1] - p3[1]) - (p4[1] - p3[1]) * (p1[0] - p3[0])) / denominator;
    const ub = ((p2[0] - p1[0]) * (p1[1] - p3[1]) - (p2[1] - p1[1]) * (p1[0] - p3[0])) / denominator;
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return void 0;
    }
    const x = p1[0] + ua * (p2[0] - p1[0]);
    const y = p1[1] + ua * (p2[1] - p1[1]);
    return [x, y];
  };
  intersect_1$1 = intersect;
  return intersect_1$1;
}
var solve2Linear_1;
var hasRequiredSolve2Linear;
function requireSolve2Linear() {
  if (hasRequiredSolve2Linear) return solve2Linear_1;
  hasRequiredSolve2Linear = 1;
  const solve2Linear = (a, b, c, d, u, v) => {
    const det = a * d - b * c;
    const invdet = 1 / det;
    let x = u * d - b * v;
    let y = -u * c + a * v;
    x *= invdet;
    y *= invdet;
    return [x, y];
  };
  solve2Linear_1 = solve2Linear;
  return solve2Linear_1;
}
var utils$1;
var hasRequiredUtils$1;
function requireUtils$1() {
  if (hasRequiredUtils$1) return utils$1;
  hasRequiredUtils$1 = 1;
  utils$1 = {
    aboutEqualNormals: requireAboutEqualNormals(),
    area: requireArea(),
    cos: requireTrigonometry().cos,
    interpolateBetween2DPointsForY: requireInterpolateBetween2DPointsForY(),
    intersect: requireIntersect$1(),
    sin: requireTrigonometry().sin,
    solve2Linear: requireSolve2Linear()
  };
  return utils$1;
}
var intersectPointOfLines;
var hasRequiredIntersectPointOfLines;
function requireIntersectPointOfLines() {
  if (hasRequiredIntersectPointOfLines) return intersectPointOfLines;
  hasRequiredIntersectPointOfLines = 1;
  const vec22 = requireVec2();
  const { solve2Linear } = requireUtils$1();
  const intersectToLine = (line1, line22) => {
    const point = solve2Linear(line1[0], line1[1], line22[0], line22[1], line1[2], line22[2]);
    return vec22.clone(point);
  };
  intersectPointOfLines = intersectToLine;
  return intersectPointOfLines;
}
var reverse_1$2;
var hasRequiredReverse$2;
function requireReverse$2() {
  if (hasRequiredReverse$2) return reverse_1$2;
  hasRequiredReverse$2 = 1;
  const vec22 = requireVec2();
  const copy = requireCopy$1();
  const fromValues = requireFromValues();
  const reverse = (out, line) => {
    const normal = vec22.negate(vec22.create(), line);
    const distance = -line[2];
    return copy(out, fromValues(normal[0], normal[1], distance));
  };
  reverse_1$2 = reverse;
  return reverse_1$2;
}
var toString_1$2;
var hasRequiredToString$2;
function requireToString$2() {
  if (hasRequiredToString$2) return toString_1$2;
  hasRequiredToString$2 = 1;
  const toString = (line) => `line2: (${line[0].toFixed(7)}, ${line[1].toFixed(7)}, ${line[2].toFixed(7)})`;
  toString_1$2 = toString;
  return toString_1$2;
}
var transform_1$3;
var hasRequiredTransform$3;
function requireTransform$3() {
  if (hasRequiredTransform$3) return transform_1$3;
  hasRequiredTransform$3 = 1;
  const vec22 = requireVec2();
  const fromPoints = requireFromPoints$2();
  const origin = requireOrigin$1();
  const direction = requireDirection$1();
  const transform = (out, line, matrix) => {
    const org = origin(line);
    const dir = direction(line);
    vec22.transform(org, org, matrix);
    vec22.transform(dir, dir, matrix);
    return fromPoints(out, org, dir);
  };
  transform_1$3 = transform;
  return transform_1$3;
}
var xAtY_1;
var hasRequiredXAtY;
function requireXAtY() {
  if (hasRequiredXAtY) return xAtY_1;
  hasRequiredXAtY = 1;
  const origin = requireOrigin$1();
  const xAtY = (line, y) => {
    let x = (line[2] - line[1] * y) / line[0];
    if (Number.isNaN(x)) {
      const org = origin(line);
      x = org[0];
    }
    return x;
  };
  xAtY_1 = xAtY;
  return xAtY_1;
}
var line2;
var hasRequiredLine2;
function requireLine2() {
  if (hasRequiredLine2) return line2;
  hasRequiredLine2 = 1;
  line2 = {
    clone: requireClone$2(),
    closestPoint: requireClosestPoint$1(),
    copy: requireCopy$1(),
    create: requireCreate$2(),
    direction: requireDirection$1(),
    distanceToPoint: requireDistanceToPoint$1(),
    equals: requireEquals$2(),
    fromPoints: requireFromPoints$2(),
    fromValues: requireFromValues(),
    intersectPointOfLines: requireIntersectPointOfLines(),
    origin: requireOrigin$1(),
    reverse: requireReverse$2(),
    toString: requireToString$2(),
    transform: requireTransform$3(),
    xAtY: requireXAtY()
  };
  return line2;
}
var create_1$1;
var hasRequiredCreate$1;
function requireCreate$1() {
  if (hasRequiredCreate$1) return create_1$1;
  hasRequiredCreate$1 = 1;
  const vec32 = requireVec3();
  const create = () => [
    vec32.fromValues(0, 0, 0),
    // origin
    vec32.fromValues(0, 0, 1)
    // direction
  ];
  create_1$1 = create;
  return create_1$1;
}
var clone_1$1;
var hasRequiredClone$1;
function requireClone$1() {
  if (hasRequiredClone$1) return clone_1$1;
  hasRequiredClone$1 = 1;
  const vec32 = requireVec3();
  const create = requireCreate$1();
  const clone = (line) => {
    const out = create();
    vec32.copy(out[0], line[0]);
    vec32.copy(out[1], line[1]);
    return out;
  };
  clone_1$1 = clone;
  return clone_1$1;
}
var closestPoint_1;
var hasRequiredClosestPoint;
function requireClosestPoint() {
  if (hasRequiredClosestPoint) return closestPoint_1;
  hasRequiredClosestPoint = 1;
  const vec32 = requireVec3();
  const closestPoint = (line, point) => {
    const lpoint = line[0];
    const ldirection = line[1];
    const a = vec32.dot(vec32.subtract(vec32.create(), point, lpoint), ldirection);
    const b = vec32.dot(ldirection, ldirection);
    const t = a / b;
    const closestpoint = vec32.scale(vec32.create(), ldirection, t);
    vec32.add(closestpoint, closestpoint, lpoint);
    return closestpoint;
  };
  closestPoint_1 = closestPoint;
  return closestPoint_1;
}
var copy_1;
var hasRequiredCopy;
function requireCopy() {
  if (hasRequiredCopy) return copy_1;
  hasRequiredCopy = 1;
  const vec32 = requireVec3();
  const copy = (out, line) => {
    vec32.copy(out[0], line[0]);
    vec32.copy(out[1], line[1]);
    return out;
  };
  copy_1 = copy;
  return copy_1;
}
var direction_1;
var hasRequiredDirection;
function requireDirection() {
  if (hasRequiredDirection) return direction_1;
  hasRequiredDirection = 1;
  const direction = (line) => line[1];
  direction_1 = direction;
  return direction_1;
}
var distanceToPoint_1;
var hasRequiredDistanceToPoint;
function requireDistanceToPoint() {
  if (hasRequiredDistanceToPoint) return distanceToPoint_1;
  hasRequiredDistanceToPoint = 1;
  const vec32 = requireVec3();
  const closestPoint = requireClosestPoint();
  const distanceToPoint = (line, point) => {
    const closest = closestPoint(line, point);
    const distancevector = vec32.subtract(vec32.create(), point, closest);
    return vec32.length(distancevector);
  };
  distanceToPoint_1 = distanceToPoint;
  return distanceToPoint_1;
}
var equals_1$1;
var hasRequiredEquals$1;
function requireEquals$1() {
  if (hasRequiredEquals$1) return equals_1$1;
  hasRequiredEquals$1 = 1;
  const vec32 = requireVec3();
  const equals = (line1, line22) => {
    if (!vec32.equals(line1[1], line22[1])) return false;
    if (!vec32.equals(line1[0], line22[0])) return false;
    return true;
  };
  equals_1$1 = equals;
  return equals_1$1;
}
var fromPointAndDirection_1;
var hasRequiredFromPointAndDirection;
function requireFromPointAndDirection() {
  if (hasRequiredFromPointAndDirection) return fromPointAndDirection_1;
  hasRequiredFromPointAndDirection = 1;
  const vec32 = requireVec3();
  const fromPointAndDirection = (out, point, direction) => {
    const unit = vec32.normalize(vec32.create(), direction);
    vec32.copy(out[0], point);
    vec32.copy(out[1], unit);
    return out;
  };
  fromPointAndDirection_1 = fromPointAndDirection;
  return fromPointAndDirection_1;
}
var fromPlanes_1;
var hasRequiredFromPlanes;
function requireFromPlanes() {
  if (hasRequiredFromPlanes) return fromPlanes_1;
  hasRequiredFromPlanes = 1;
  const vec32 = requireVec3();
  const { solve2Linear } = requireUtils$1();
  const { EPS } = requireConstants();
  const fromPointAndDirection = requireFromPointAndDirection();
  const fromPlanes = (out, plane1, plane2) => {
    let direction = vec32.cross(vec32.create(), plane1, plane2);
    let length = vec32.length(direction);
    if (length < EPS) {
      throw new Error("parallel planes do not intersect");
    }
    length = 1 / length;
    direction = vec32.scale(direction, direction, length);
    const absx = Math.abs(direction[0]);
    const absy = Math.abs(direction[1]);
    const absz = Math.abs(direction[2]);
    let origin;
    let r;
    if (absx >= absy && absx >= absz) {
      r = solve2Linear(plane1[1], plane1[2], plane2[1], plane2[2], plane1[3], plane2[3]);
      origin = vec32.fromValues(0, r[0], r[1]);
    } else if (absy >= absx && absy >= absz) {
      r = solve2Linear(plane1[0], plane1[2], plane2[0], plane2[2], plane1[3], plane2[3]);
      origin = vec32.fromValues(r[0], 0, r[1]);
    } else {
      r = solve2Linear(plane1[0], plane1[1], plane2[0], plane2[1], plane1[3], plane2[3]);
      origin = vec32.fromValues(r[0], r[1], 0);
    }
    return fromPointAndDirection(out, origin, direction);
  };
  fromPlanes_1 = fromPlanes;
  return fromPlanes_1;
}
var fromPoints_1$1;
var hasRequiredFromPoints$1;
function requireFromPoints$1() {
  if (hasRequiredFromPoints$1) return fromPoints_1$1;
  hasRequiredFromPoints$1 = 1;
  const vec32 = requireVec3();
  const fromPointAndDirection = requireFromPointAndDirection();
  const fromPoints = (out, point1, point2) => {
    const direction = vec32.subtract(vec32.create(), point2, point1);
    return fromPointAndDirection(out, point1, direction);
  };
  fromPoints_1$1 = fromPoints;
  return fromPoints_1$1;
}
var intersectPointOfLineAndPlane;
var hasRequiredIntersectPointOfLineAndPlane;
function requireIntersectPointOfLineAndPlane() {
  if (hasRequiredIntersectPointOfLineAndPlane) return intersectPointOfLineAndPlane;
  hasRequiredIntersectPointOfLineAndPlane = 1;
  const vec32 = requireVec3();
  const intersectToPlane = (line, plane2) => {
    const pnormal = plane2;
    const pw = plane2[3];
    const lpoint = line[0];
    const ldirection = line[1];
    const labda = (pw - vec32.dot(pnormal, lpoint)) / vec32.dot(pnormal, ldirection);
    const point = vec32.add(vec32.create(), lpoint, vec32.scale(vec32.create(), ldirection, labda));
    return point;
  };
  intersectPointOfLineAndPlane = intersectToPlane;
  return intersectPointOfLineAndPlane;
}
var origin_1;
var hasRequiredOrigin;
function requireOrigin() {
  if (hasRequiredOrigin) return origin_1;
  hasRequiredOrigin = 1;
  const origin = (line) => line[0];
  origin_1 = origin;
  return origin_1;
}
var reverse_1$1;
var hasRequiredReverse$1;
function requireReverse$1() {
  if (hasRequiredReverse$1) return reverse_1$1;
  hasRequiredReverse$1 = 1;
  const vec32 = requireVec3();
  const fromPointAndDirection = requireFromPointAndDirection();
  const reverse = (out, line) => {
    const point = vec32.clone(line[0]);
    const direction = vec32.negate(vec32.create(), line[1]);
    return fromPointAndDirection(out, point, direction);
  };
  reverse_1$1 = reverse;
  return reverse_1$1;
}
var toString_1$1;
var hasRequiredToString$1;
function requireToString$1() {
  if (hasRequiredToString$1) return toString_1$1;
  hasRequiredToString$1 = 1;
  const toString = (line) => {
    const point = line[0];
    const direction = line[1];
    return `line3: point: (${point[0].toFixed(7)}, ${point[1].toFixed(7)}, ${point[2].toFixed(7)}) direction: (${direction[0].toFixed(7)}, ${direction[1].toFixed(7)}, ${direction[2].toFixed(7)})`;
  };
  toString_1$1 = toString;
  return toString_1$1;
}
var transform_1$2;
var hasRequiredTransform$2;
function requireTransform$2() {
  if (hasRequiredTransform$2) return transform_1$2;
  hasRequiredTransform$2 = 1;
  const vec32 = requireVec3();
  const fromPointAndDirection = requireFromPointAndDirection();
  const transform = (out, line, matrix) => {
    const point = line[0];
    const direction = line[1];
    const pointPlusDirection = vec32.add(vec32.create(), point, direction);
    const newpoint = vec32.transform(vec32.create(), point, matrix);
    const newPointPlusDirection = vec32.transform(pointPlusDirection, pointPlusDirection, matrix);
    const newdirection = vec32.subtract(newPointPlusDirection, newPointPlusDirection, newpoint);
    return fromPointAndDirection(out, newpoint, newdirection);
  };
  transform_1$2 = transform;
  return transform_1$2;
}
var line3;
var hasRequiredLine3;
function requireLine3() {
  if (hasRequiredLine3) return line3;
  hasRequiredLine3 = 1;
  line3 = {
    clone: requireClone$1(),
    closestPoint: requireClosestPoint(),
    copy: requireCopy(),
    create: requireCreate$1(),
    direction: requireDirection(),
    distanceToPoint: requireDistanceToPoint(),
    equals: requireEquals$1(),
    fromPlanes: requireFromPlanes(),
    fromPointAndDirection: requireFromPointAndDirection(),
    fromPoints: requireFromPoints$1(),
    intersectPointOfLineAndPlane: requireIntersectPointOfLineAndPlane(),
    origin: requireOrigin(),
    reverse: requireReverse$1(),
    toString: requireToString$1(),
    transform: requireTransform$2()
  };
  return line3;
}
var maths;
var hasRequiredMaths;
function requireMaths() {
  if (hasRequiredMaths) return maths;
  hasRequiredMaths = 1;
  maths = {
    constants: requireConstants(),
    line2: requireLine2(),
    line3: requireLine3(),
    mat4: requireMat4(),
    plane: requirePlane$1(),
    utils: requireUtils$1(),
    vec2: requireVec2(),
    vec3: requireVec3(),
    vec4: requireVec4()
  };
  return maths;
}
var measureArea_1;
var hasRequiredMeasureArea;
function requireMeasureArea() {
  if (hasRequiredMeasureArea) return measureArea_1;
  hasRequiredMeasureArea = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const poly32 = requirePoly3();
  const cache2 = /* @__PURE__ */ new WeakMap();
  const measureAreaOfPath2 = () => 0;
  const measureAreaOfGeom2 = (geometry) => {
    let area = cache2.get(geometry);
    if (area) return area;
    const sides = geom22.toSides(geometry);
    area = sides.reduce((area2, side) => area2 + (side[0][0] * side[1][1] - side[0][1] * side[1][0]), 0);
    area *= 0.5;
    cache2.set(geometry, area);
    return area;
  };
  const measureAreaOfGeom3 = (geometry) => {
    let area = cache2.get(geometry);
    if (area) return area;
    const polygons = geom32.toPolygons(geometry);
    area = polygons.reduce((area2, polygon) => area2 + poly32.measureArea(polygon), 0);
    cache2.set(geometry, area);
    return area;
  };
  const measureArea = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path22.isA(geometry)) return measureAreaOfPath2();
      if (geom22.isA(geometry)) return measureAreaOfGeom2(geometry);
      if (geom32.isA(geometry)) return measureAreaOfGeom3(geometry);
      return 0;
    });
    return results.length === 1 ? results[0] : results;
  };
  measureArea_1 = measureArea;
  return measureArea_1;
}
var measureAggregateArea_1;
var hasRequiredMeasureAggregateArea;
function requireMeasureAggregateArea() {
  if (hasRequiredMeasureAggregateArea) return measureAggregateArea_1;
  hasRequiredMeasureAggregateArea = 1;
  const flatten = requireFlatten();
  const measureArea = requireMeasureArea();
  const measureAggregateArea = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("measureAggregateArea: no geometries supplied");
    const areas = measureArea(geometries2);
    if (geometries2.length === 1) {
      return areas;
    }
    const result = 0;
    return areas.reduce((result2, area) => result2 + area, result);
  };
  measureAggregateArea_1 = measureAggregateArea;
  return measureAggregateArea_1;
}
var measureBoundingBox_1;
var hasRequiredMeasureBoundingBox;
function requireMeasureBoundingBox() {
  if (hasRequiredMeasureBoundingBox) return measureBoundingBox_1;
  hasRequiredMeasureBoundingBox = 1;
  const flatten = requireFlatten();
  const vec22 = requireVec2();
  const vec32 = requireVec3();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const poly32 = requirePoly3();
  const cache2 = /* @__PURE__ */ new WeakMap();
  const measureBoundingBoxOfPath2 = (geometry) => {
    let boundingBox = cache2.get(geometry);
    if (boundingBox) return boundingBox;
    const points = path22.toPoints(geometry);
    let minpoint;
    if (points.length === 0) {
      minpoint = vec22.create();
    } else {
      minpoint = vec22.clone(points[0]);
    }
    let maxpoint = vec22.clone(minpoint);
    points.forEach((point) => {
      vec22.min(minpoint, minpoint, point);
      vec22.max(maxpoint, maxpoint, point);
    });
    minpoint = [minpoint[0], minpoint[1], 0];
    maxpoint = [maxpoint[0], maxpoint[1], 0];
    boundingBox = [minpoint, maxpoint];
    cache2.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBoxOfGeom2 = (geometry) => {
    let boundingBox = cache2.get(geometry);
    if (boundingBox) return boundingBox;
    const points = geom22.toPoints(geometry);
    let minpoint;
    if (points.length === 0) {
      minpoint = vec22.create();
    } else {
      minpoint = vec22.clone(points[0]);
    }
    let maxpoint = vec22.clone(minpoint);
    points.forEach((point) => {
      vec22.min(minpoint, minpoint, point);
      vec22.max(maxpoint, maxpoint, point);
    });
    minpoint = [minpoint[0], minpoint[1], 0];
    maxpoint = [maxpoint[0], maxpoint[1], 0];
    boundingBox = [minpoint, maxpoint];
    cache2.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBoxOfGeom3 = (geometry) => {
    let boundingBox = cache2.get(geometry);
    if (boundingBox) return boundingBox;
    const polygons = geom32.toPolygons(geometry);
    let minpoint = vec32.create();
    if (polygons.length > 0) {
      const points = poly32.toPoints(polygons[0]);
      vec32.copy(minpoint, points[0]);
    }
    let maxpoint = vec32.clone(minpoint);
    polygons.forEach((polygon) => {
      poly32.toPoints(polygon).forEach((point) => {
        vec32.min(minpoint, minpoint, point);
        vec32.max(maxpoint, maxpoint, point);
      });
    });
    minpoint = [minpoint[0], minpoint[1], minpoint[2]];
    maxpoint = [maxpoint[0], maxpoint[1], maxpoint[2]];
    boundingBox = [minpoint, maxpoint];
    cache2.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBox = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path22.isA(geometry)) return measureBoundingBoxOfPath2(geometry);
      if (geom22.isA(geometry)) return measureBoundingBoxOfGeom2(geometry);
      if (geom32.isA(geometry)) return measureBoundingBoxOfGeom3(geometry);
      return [[0, 0, 0], [0, 0, 0]];
    });
    return results.length === 1 ? results[0] : results;
  };
  measureBoundingBox_1 = measureBoundingBox;
  return measureBoundingBox_1;
}
var measureAggregateBoundingBox_1;
var hasRequiredMeasureAggregateBoundingBox;
function requireMeasureAggregateBoundingBox() {
  if (hasRequiredMeasureAggregateBoundingBox) return measureAggregateBoundingBox_1;
  hasRequiredMeasureAggregateBoundingBox = 1;
  const flatten = requireFlatten();
  const vec3min = requireMin$1();
  const vec3max = requireMax$1();
  const measureBoundingBox = requireMeasureBoundingBox();
  const measureAggregateBoundingBox = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("measureAggregateBoundingBox: no geometries supplied");
    const bounds2 = measureBoundingBox(geometries2);
    if (geometries2.length === 1) {
      return bounds2;
    }
    const result = [[Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE], [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE]];
    return bounds2.reduce((result2, item) => {
      result2 = [vec3min(result2[0], result2[0], item[0]), vec3max(result2[1], result2[1], item[1])];
      return result2;
    }, result);
  };
  measureAggregateBoundingBox_1 = measureAggregateBoundingBox;
  return measureAggregateBoundingBox_1;
}
var calculateEpsilonFromBounds_1;
var hasRequiredCalculateEpsilonFromBounds;
function requireCalculateEpsilonFromBounds() {
  if (hasRequiredCalculateEpsilonFromBounds) return calculateEpsilonFromBounds_1;
  hasRequiredCalculateEpsilonFromBounds = 1;
  const { EPS } = requireConstants();
  const calculateEpsilonFromBounds = (bounds2, dimensions) => {
    let total = 0;
    for (let i = 0; i < dimensions; i++) {
      total += bounds2[1][i] - bounds2[0][i];
    }
    return EPS * total / dimensions;
  };
  calculateEpsilonFromBounds_1 = calculateEpsilonFromBounds;
  return calculateEpsilonFromBounds_1;
}
var measureAggregateEpsilon_1;
var hasRequiredMeasureAggregateEpsilon;
function requireMeasureAggregateEpsilon() {
  if (hasRequiredMeasureAggregateEpsilon) return measureAggregateEpsilon_1;
  hasRequiredMeasureAggregateEpsilon = 1;
  const flatten = requireFlatten();
  const measureAggregateBoundingBox = requireMeasureAggregateBoundingBox();
  const calculateEpsilonFromBounds = requireCalculateEpsilonFromBounds();
  const { geom2: geom22, geom3: geom32, path2: path22 } = requireGeometries();
  const measureAggregateEpsilon = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("measureAggregateEpsilon: no geometries supplied");
    const bounds2 = measureAggregateBoundingBox(geometries2);
    let dimensions = 0;
    dimensions = geometries2.reduce((dimensions2, geometry) => {
      if (path22.isA(geometry) || geom22.isA(geometry)) return Math.max(dimensions2, 2);
      if (geom32.isA(geometry)) return Math.max(dimensions2, 3);
      return 0;
    }, dimensions);
    return calculateEpsilonFromBounds(bounds2, dimensions);
  };
  measureAggregateEpsilon_1 = measureAggregateEpsilon;
  return measureAggregateEpsilon_1;
}
var measureVolume_1;
var hasRequiredMeasureVolume;
function requireMeasureVolume() {
  if (hasRequiredMeasureVolume) return measureVolume_1;
  hasRequiredMeasureVolume = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const poly32 = requirePoly3();
  const cache2 = /* @__PURE__ */ new WeakMap();
  const measureVolumeOfPath2 = () => 0;
  const measureVolumeOfGeom2 = () => 0;
  const measureVolumeOfGeom3 = (geometry) => {
    let volume = cache2.get(geometry);
    if (volume) return volume;
    const polygons = geom32.toPolygons(geometry);
    volume = polygons.reduce((volume2, polygon) => volume2 + poly32.measureSignedVolume(polygon), 0);
    cache2.set(geometry, volume);
    return volume;
  };
  const measureVolume = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path22.isA(geometry)) return measureVolumeOfPath2();
      if (geom22.isA(geometry)) return measureVolumeOfGeom2();
      if (geom32.isA(geometry)) return measureVolumeOfGeom3(geometry);
      return 0;
    });
    return results.length === 1 ? results[0] : results;
  };
  measureVolume_1 = measureVolume;
  return measureVolume_1;
}
var measureAggregateVolume_1;
var hasRequiredMeasureAggregateVolume;
function requireMeasureAggregateVolume() {
  if (hasRequiredMeasureAggregateVolume) return measureAggregateVolume_1;
  hasRequiredMeasureAggregateVolume = 1;
  const flatten = requireFlatten();
  const measureVolume = requireMeasureVolume();
  const measureAggregateVolume = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("measureAggregateVolume: no geometries supplied");
    const volumes = measureVolume(geometries2);
    if (geometries2.length === 1) {
      return volumes;
    }
    const result = 0;
    return volumes.reduce((result2, volume) => result2 + volume, result);
  };
  measureAggregateVolume_1 = measureAggregateVolume;
  return measureAggregateVolume_1;
}
var measureBoundingSphere_1;
var hasRequiredMeasureBoundingSphere;
function requireMeasureBoundingSphere() {
  if (hasRequiredMeasureBoundingSphere) return measureBoundingSphere_1;
  hasRequiredMeasureBoundingSphere = 1;
  const flatten = requireFlatten();
  const vec22 = requireVec2();
  const vec32 = requireVec3();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const poly32 = requirePoly3();
  const cacheOfBoundingSpheres = /* @__PURE__ */ new WeakMap();
  const measureBoundingSphereOfPath2 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0) return boundingSphere;
    const centroid = vec32.create();
    let radius2 = 0;
    const points = path22.toPoints(geometry);
    if (points.length > 0) {
      let numPoints = 0;
      const temp = vec32.create();
      points.forEach((point) => {
        vec32.add(centroid, centroid, vec32.fromVec2(temp, point, 0));
        numPoints++;
      });
      vec32.scale(centroid, centroid, 1 / numPoints);
      points.forEach((point) => {
        radius2 = Math.max(radius2, vec22.squaredDistance(centroid, point));
      });
      radius2 = Math.sqrt(radius2);
    }
    boundingSphere = [centroid, radius2];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphereOfGeom2 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0) return boundingSphere;
    const centroid = vec32.create();
    let radius2 = 0;
    const sides = geom22.toSides(geometry);
    if (sides.length > 0) {
      let numPoints = 0;
      const temp = vec32.create();
      sides.forEach((side) => {
        vec32.add(centroid, centroid, vec32.fromVec2(temp, side[0], 0));
        numPoints++;
      });
      vec32.scale(centroid, centroid, 1 / numPoints);
      sides.forEach((side) => {
        radius2 = Math.max(radius2, vec22.squaredDistance(centroid, side[0]));
      });
      radius2 = Math.sqrt(radius2);
    }
    boundingSphere = [centroid, radius2];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphereOfGeom3 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0) return boundingSphere;
    const centroid = vec32.create();
    let radius2 = 0;
    const polygons = geom32.toPolygons(geometry);
    if (polygons.length > 0) {
      let numPoints = 0;
      polygons.forEach((polygon) => {
        poly32.toPoints(polygon).forEach((point) => {
          vec32.add(centroid, centroid, point);
          numPoints++;
        });
      });
      vec32.scale(centroid, centroid, 1 / numPoints);
      polygons.forEach((polygon) => {
        poly32.toPoints(polygon).forEach((point) => {
          radius2 = Math.max(radius2, vec32.squaredDistance(centroid, point));
        });
      });
      radius2 = Math.sqrt(radius2);
    }
    boundingSphere = [centroid, radius2];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphere = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const results = geometries2.map((geometry) => {
      if (path22.isA(geometry)) return measureBoundingSphereOfPath2(geometry);
      if (geom22.isA(geometry)) return measureBoundingSphereOfGeom2(geometry);
      if (geom32.isA(geometry)) return measureBoundingSphereOfGeom3(geometry);
      return [[0, 0, 0], 0];
    });
    return results.length === 1 ? results[0] : results;
  };
  measureBoundingSphere_1 = measureBoundingSphere;
  return measureBoundingSphere_1;
}
var measureCenter_1;
var hasRequiredMeasureCenter;
function requireMeasureCenter() {
  if (hasRequiredMeasureCenter) return measureCenter_1;
  hasRequiredMeasureCenter = 1;
  const flatten = requireFlatten();
  const measureBoundingBox = requireMeasureBoundingBox();
  const measureCenter = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const results = geometries2.map((geometry) => {
      const bounds2 = measureBoundingBox(geometry);
      return [
        bounds2[0][0] + (bounds2[1][0] - bounds2[0][0]) / 2,
        bounds2[0][1] + (bounds2[1][1] - bounds2[0][1]) / 2,
        bounds2[0][2] + (bounds2[1][2] - bounds2[0][2]) / 2
      ];
    });
    return results.length === 1 ? results[0] : results;
  };
  measureCenter_1 = measureCenter;
  return measureCenter_1;
}
var measureCenterOfMass_1;
var hasRequiredMeasureCenterOfMass;
function requireMeasureCenterOfMass() {
  if (hasRequiredMeasureCenterOfMass) return measureCenterOfMass_1;
  hasRequiredMeasureCenterOfMass = 1;
  const flatten = requireFlatten();
  const vec32 = requireVec3();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const cacheOfCenterOfMass = /* @__PURE__ */ new WeakMap();
  const measureCenterOfMassGeom2 = (geometry) => {
    let centerOfMass = cacheOfCenterOfMass.get(geometry);
    if (centerOfMass !== void 0) return centerOfMass;
    const sides = geom22.toSides(geometry);
    let area = 0;
    let x = 0;
    let y = 0;
    if (sides.length > 0) {
      for (let i = 0; i < sides.length; i++) {
        const p1 = sides[i][0];
        const p2 = sides[i][1];
        const a = p1[0] * p2[1] - p1[1] * p2[0];
        area += a;
        x += (p1[0] + p2[0]) * a;
        y += (p1[1] + p2[1]) * a;
      }
      area /= 2;
      const f = 1 / (area * 6);
      x *= f;
      y *= f;
    }
    centerOfMass = vec32.fromValues(x, y, 0);
    cacheOfCenterOfMass.set(geometry, centerOfMass);
    return centerOfMass;
  };
  const measureCenterOfMassGeom3 = (geometry) => {
    let centerOfMass = cacheOfCenterOfMass.get(geometry);
    if (centerOfMass !== void 0) return centerOfMass;
    centerOfMass = vec32.create();
    const polygons = geom32.toPolygons(geometry);
    if (polygons.length === 0) return centerOfMass;
    let totalVolume = 0;
    const vector = vec32.create();
    polygons.forEach((polygon) => {
      const vertices = polygon.vertices;
      for (let i = 0; i < vertices.length - 2; i++) {
        vec32.cross(vector, vertices[i + 1], vertices[i + 2]);
        const volume = vec32.dot(vertices[0], vector) / 6;
        totalVolume += volume;
        vec32.add(vector, vertices[0], vertices[i + 1]);
        vec32.add(vector, vector, vertices[i + 2]);
        const weightedCenter = vec32.scale(vector, vector, 1 / 4 * volume);
        vec32.add(centerOfMass, centerOfMass, weightedCenter);
      }
    });
    vec32.scale(centerOfMass, centerOfMass, 1 / totalVolume);
    cacheOfCenterOfMass.set(geometry, centerOfMass);
    return centerOfMass;
  };
  const measureCenterOfMass = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const results = geometries2.map((geometry) => {
      if (geom22.isA(geometry)) return measureCenterOfMassGeom2(geometry);
      if (geom32.isA(geometry)) return measureCenterOfMassGeom3(geometry);
      return [0, 0, 0];
    });
    return results.length === 1 ? results[0] : results;
  };
  measureCenterOfMass_1 = measureCenterOfMass;
  return measureCenterOfMass_1;
}
var measureDimensions_1;
var hasRequiredMeasureDimensions;
function requireMeasureDimensions() {
  if (hasRequiredMeasureDimensions) return measureDimensions_1;
  hasRequiredMeasureDimensions = 1;
  const flatten = requireFlatten();
  const measureBoundingBox = requireMeasureBoundingBox();
  const measureDimensions = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const results = geometries2.map((geometry) => {
      const boundingBox = measureBoundingBox(geometry);
      return [
        boundingBox[1][0] - boundingBox[0][0],
        boundingBox[1][1] - boundingBox[0][1],
        boundingBox[1][2] - boundingBox[0][2]
      ];
    });
    return results.length === 1 ? results[0] : results;
  };
  measureDimensions_1 = measureDimensions;
  return measureDimensions_1;
}
var measureEpsilon_1;
var hasRequiredMeasureEpsilon;
function requireMeasureEpsilon() {
  if (hasRequiredMeasureEpsilon) return measureEpsilon_1;
  hasRequiredMeasureEpsilon = 1;
  const flatten = requireFlatten();
  const { geom2: geom22, geom3: geom32, path2: path22 } = requireGeometries();
  const calculateEpsilonFromBounds = requireCalculateEpsilonFromBounds();
  const measureBoundingBox = requireMeasureBoundingBox();
  const measureEpsilonOfPath2 = (geometry) => calculateEpsilonFromBounds(measureBoundingBox(geometry), 2);
  const measureEpsilonOfGeom2 = (geometry) => calculateEpsilonFromBounds(measureBoundingBox(geometry), 2);
  const measureEpsilonOfGeom3 = (geometry) => calculateEpsilonFromBounds(measureBoundingBox(geometry), 3);
  const measureEpsilon = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path22.isA(geometry)) return measureEpsilonOfPath2(geometry);
      if (geom22.isA(geometry)) return measureEpsilonOfGeom2(geometry);
      if (geom32.isA(geometry)) return measureEpsilonOfGeom3(geometry);
      return 0;
    });
    return results.length === 1 ? results[0] : results;
  };
  measureEpsilon_1 = measureEpsilon;
  return measureEpsilon_1;
}
var measurements;
var hasRequiredMeasurements;
function requireMeasurements() {
  if (hasRequiredMeasurements) return measurements;
  hasRequiredMeasurements = 1;
  measurements = {
    measureAggregateArea: requireMeasureAggregateArea(),
    measureAggregateBoundingBox: requireMeasureAggregateBoundingBox(),
    measureAggregateEpsilon: requireMeasureAggregateEpsilon(),
    measureAggregateVolume: requireMeasureAggregateVolume(),
    measureArea: requireMeasureArea(),
    measureBoundingBox: requireMeasureBoundingBox(),
    measureBoundingSphere: requireMeasureBoundingSphere(),
    measureCenter: requireMeasureCenter(),
    measureCenterOfMass: requireMeasureCenterOfMass(),
    measureDimensions: requireMeasureDimensions(),
    measureEpsilon: requireMeasureEpsilon(),
    measureVolume: requireMeasureVolume()
  };
  return measurements;
}
var commonChecks;
var hasRequiredCommonChecks;
function requireCommonChecks() {
  if (hasRequiredCommonChecks) return commonChecks;
  hasRequiredCommonChecks = 1;
  const isNumberArray = (array, dimension) => {
    if (Array.isArray(array) && array.length >= dimension) {
      return array.every((n) => Number.isFinite(n));
    }
    return false;
  };
  const isGT = (value, constant) => Number.isFinite(value) && value > constant;
  const isGTE = (value, constant) => Number.isFinite(value) && value >= constant;
  commonChecks = {
    isNumberArray,
    isGT,
    isGTE
  };
  return commonChecks;
}
var arc_1;
var hasRequiredArc;
function requireArc() {
  if (hasRequiredArc) return arc_1;
  hasRequiredArc = 1;
  const { EPS, TAU } = requireConstants();
  const vec22 = requireVec2();
  const path22 = requirePath2();
  const { isGT, isGTE, isNumberArray } = requireCommonChecks();
  const arc = (options) => {
    const defaults = {
      center: [0, 0],
      radius: 1,
      startAngle: 0,
      endAngle: TAU,
      makeTangent: false,
      segments: 32
    };
    let { center, radius: radius2, startAngle, endAngle, makeTangent, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 2)) throw new Error("center must be an array of X and Y values");
    if (!isGT(radius2, 0)) throw new Error("radius must be greater than zero");
    if (!isGTE(startAngle, 0)) throw new Error("startAngle must be positive");
    if (!isGTE(endAngle, 0)) throw new Error("endAngle must be positive");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    startAngle = startAngle % TAU;
    endAngle = endAngle % TAU;
    let rotation = TAU;
    if (startAngle < endAngle) {
      rotation = endAngle - startAngle;
    }
    if (startAngle > endAngle) {
      rotation = endAngle + (TAU - startAngle);
    }
    const minangle = Math.acos((radius2 * radius2 + radius2 * radius2 - EPS * EPS) / (2 * radius2 * radius2));
    const centerv = vec22.clone(center);
    let point;
    const pointArray = [];
    if (rotation < minangle) {
      point = vec22.fromAngleRadians(vec22.create(), startAngle);
      vec22.scale(point, point, radius2);
      vec22.add(point, point, centerv);
      pointArray.push(point);
    } else {
      const numsteps = Math.floor(segments * (Math.abs(rotation) / TAU));
      let edgestepsize = numsteps * 0.5 / rotation;
      if (edgestepsize > 0.25) edgestepsize = 0.25;
      const totalsteps = makeTangent ? numsteps + 2 : numsteps;
      for (let i = 0; i <= totalsteps; i++) {
        let step = i;
        if (makeTangent) {
          step = (i - 1) * (numsteps - 2 * edgestepsize) / numsteps + edgestepsize;
          if (step < 0) step = 0;
          if (step > numsteps) step = numsteps;
        }
        const angle2 = startAngle + step * (rotation / numsteps);
        point = vec22.fromAngleRadians(vec22.create(), angle2);
        vec22.scale(point, point, radius2);
        vec22.add(point, point, centerv);
        pointArray.push(point);
      }
    }
    return path22.fromPoints({ closed: false }, pointArray);
  };
  arc_1 = arc;
  return arc_1;
}
var ellipse_1;
var hasRequiredEllipse;
function requireEllipse() {
  if (hasRequiredEllipse) return ellipse_1;
  hasRequiredEllipse = 1;
  const { EPS, TAU } = requireConstants();
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const { sin, cos } = requireTrigonometry();
  const { isGTE, isNumberArray } = requireCommonChecks();
  const ellipse = (options) => {
    const defaults = {
      center: [0, 0],
      radius: [1, 1],
      startAngle: 0,
      endAngle: TAU,
      segments: 32
    };
    let { center, radius: radius2, startAngle, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 2)) throw new Error("center must be an array of X and Y values");
    if (!isNumberArray(radius2, 2)) throw new Error("radius must be an array of X and Y values");
    if (!radius2.every((n) => n >= 0)) throw new Error("radius values must be positive");
    if (!isGTE(startAngle, 0)) throw new Error("startAngle must be positive");
    if (!isGTE(endAngle, 0)) throw new Error("endAngle must be positive");
    if (!isGTE(segments, 3)) throw new Error("segments must be three or more");
    if (radius2[0] === 0 || radius2[1] === 0) return geom22.create();
    startAngle = startAngle % TAU;
    endAngle = endAngle % TAU;
    let rotation = TAU;
    if (startAngle < endAngle) {
      rotation = endAngle - startAngle;
    }
    if (startAngle > endAngle) {
      rotation = endAngle + (TAU - startAngle);
    }
    const minradius = Math.min(radius2[0], radius2[1]);
    const minangle = Math.acos((minradius * minradius + minradius * minradius - EPS * EPS) / (2 * minradius * minradius));
    if (rotation < minangle) throw new Error("startAngle and endAngle do not define a significant rotation");
    segments = Math.floor(segments * (rotation / TAU));
    const centerv = vec22.clone(center);
    const step = rotation / segments;
    const points = [];
    segments = rotation < TAU ? segments + 1 : segments;
    for (let i = 0; i < segments; i++) {
      const angle2 = step * i + startAngle;
      const point = vec22.fromValues(radius2[0] * cos(angle2), radius2[1] * sin(angle2));
      vec22.add(point, centerv, point);
      points.push(point);
    }
    if (rotation < TAU) points.push(centerv);
    return geom22.fromPoints(points);
  };
  ellipse_1 = ellipse;
  return ellipse_1;
}
var circle_1;
var hasRequiredCircle;
function requireCircle() {
  if (hasRequiredCircle) return circle_1;
  hasRequiredCircle = 1;
  const { TAU } = requireConstants();
  const ellipse = requireEllipse();
  const { isGTE } = requireCommonChecks();
  const circle = (options) => {
    const defaults = {
      center: [0, 0],
      radius: 1,
      startAngle: 0,
      endAngle: TAU,
      segments: 32
    };
    let { center, radius: radius2, startAngle, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isGTE(radius2, 0)) throw new Error("radius must be positive");
    radius2 = [radius2, radius2];
    return ellipse({ center, radius: radius2, startAngle, endAngle, segments });
  };
  circle_1 = circle;
  return circle_1;
}
var cuboid_1;
var hasRequiredCuboid;
function requireCuboid() {
  if (hasRequiredCuboid) return cuboid_1;
  hasRequiredCuboid = 1;
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const { isNumberArray } = requireCommonChecks();
  const cuboid = (options) => {
    const defaults = {
      center: [0, 0, 0],
      size: [2, 2, 2]
    };
    const { center, size } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 3)) throw new Error("center must be an array of X, Y and Z values");
    if (!isNumberArray(size, 3)) throw new Error("size must be an array of width, depth and height values");
    if (!size.every((n) => n >= 0)) throw new Error("size values must be positive");
    if (size[0] === 0 || size[1] === 0 || size[2] === 0) return geom32.create();
    const result = geom32.create(
      // adjust a basic shape to size
      [
        [[0, 4, 6, 2], [-1, 0, 0]],
        [[1, 3, 7, 5], [1, 0, 0]],
        [[0, 1, 5, 4], [0, -1, 0]],
        [[2, 6, 7, 3], [0, 1, 0]],
        [[0, 2, 3, 1], [0, 0, -1]],
        [[4, 5, 7, 6], [0, 0, 1]]
      ].map((info) => {
        const points = info[0].map((i) => {
          const pos = [
            center[0] + size[0] / 2 * (2 * !!(i & 1) - 1),
            center[1] + size[1] / 2 * (2 * !!(i & 2) - 1),
            center[2] + size[2] / 2 * (2 * !!(i & 4) - 1)
          ];
          return pos;
        });
        return poly32.create(points);
      })
    );
    return result;
  };
  cuboid_1 = cuboid;
  return cuboid_1;
}
var cube_1;
var hasRequiredCube;
function requireCube() {
  if (hasRequiredCube) return cube_1;
  hasRequiredCube = 1;
  const cuboid = requireCuboid();
  const { isGTE } = requireCommonChecks();
  const cube = (options) => {
    const defaults = {
      center: [0, 0, 0],
      size: 2
    };
    let { center, size } = Object.assign({}, defaults, options);
    if (!isGTE(size, 0)) throw new Error("size must be positive");
    size = [size, size, size];
    return cuboid({ center, size });
  };
  cube_1 = cube;
  return cube_1;
}
var cylinderElliptic_1;
var hasRequiredCylinderElliptic;
function requireCylinderElliptic() {
  if (hasRequiredCylinderElliptic) return cylinderElliptic_1;
  hasRequiredCylinderElliptic = 1;
  const { EPS, TAU } = requireConstants();
  const vec32 = requireVec3();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const { sin, cos } = requireTrigonometry();
  const { isGT, isGTE, isNumberArray } = requireCommonChecks();
  const cylinderElliptic = (options) => {
    const defaults = {
      center: [0, 0, 0],
      height: 2,
      startRadius: [1, 1],
      startAngle: 0,
      endRadius: [1, 1],
      endAngle: TAU,
      segments: 32
    };
    let { center, height, startRadius, startAngle, endRadius, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 3)) throw new Error("center must be an array of X, Y and Z values");
    if (!isGT(height, 0)) throw new Error("height must be greater then zero");
    if (!isNumberArray(startRadius, 2)) throw new Error("startRadius must be an array of X and Y values");
    if (!startRadius.every((n) => n >= 0)) throw new Error("startRadius values must be positive");
    if (!isNumberArray(endRadius, 2)) throw new Error("endRadius must be an array of X and Y values");
    if (!endRadius.every((n) => n >= 0)) throw new Error("endRadius values must be positive");
    if (endRadius.every((n) => n === 0) && startRadius.every((n) => n === 0)) throw new Error("at least one radius must be positive");
    if (!isGTE(startAngle, 0)) throw new Error("startAngle must be positive");
    if (!isGTE(endAngle, 0)) throw new Error("endAngle must be positive");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    startAngle = startAngle % TAU;
    endAngle = endAngle % TAU;
    let rotation = TAU;
    if (startAngle < endAngle) {
      rotation = endAngle - startAngle;
    }
    if (startAngle > endAngle) {
      rotation = endAngle + (TAU - startAngle);
    }
    const minradius = Math.min(startRadius[0], startRadius[1], endRadius[0], endRadius[1]);
    const minangle = Math.acos((minradius * minradius + minradius * minradius - EPS * EPS) / (2 * minradius * minradius));
    if (rotation < minangle) throw new Error("startAngle and endAngle do not define a significant rotation");
    const slices = Math.floor(segments * (rotation / TAU));
    const start = vec32.fromValues(0, 0, -(height / 2));
    const end = vec32.fromValues(0, 0, height / 2);
    const ray = vec32.subtract(vec32.create(), end, start);
    const axisX = vec32.fromValues(1, 0, 0);
    const axisY = vec32.fromValues(0, 1, 0);
    const v1 = vec32.create();
    const v22 = vec32.create();
    const v32 = vec32.create();
    const point = (stack, slice2, radius2) => {
      const angle2 = slice2 * rotation + startAngle;
      vec32.scale(v1, axisX, radius2[0] * cos(angle2));
      vec32.scale(v22, axisY, radius2[1] * sin(angle2));
      vec32.add(v1, v1, v22);
      vec32.scale(v32, ray, stack);
      vec32.add(v32, v32, start);
      return vec32.add(vec32.create(), v1, v32);
    };
    const fromPoints = (...points) => {
      const newpoints = points.map((point2) => vec32.add(vec32.create(), point2, center));
      return poly32.create(newpoints);
    };
    const polygons = [];
    for (let i = 0; i < slices; i++) {
      const t0 = i / slices;
      let t1 = (i + 1) / slices;
      if (rotation === TAU && i === slices - 1) t1 = 0;
      if (endRadius[0] === startRadius[0] && endRadius[1] === startRadius[1]) {
        polygons.push(fromPoints(start, point(0, t1, endRadius), point(0, t0, endRadius)));
        polygons.push(fromPoints(point(0, t1, endRadius), point(1, t1, endRadius), point(1, t0, endRadius), point(0, t0, endRadius)));
        polygons.push(fromPoints(end, point(1, t0, endRadius), point(1, t1, endRadius)));
      } else {
        if (startRadius[0] > 0 && startRadius[1] > 0) {
          polygons.push(fromPoints(start, point(0, t1, startRadius), point(0, t0, startRadius)));
        }
        if (startRadius[0] > 0 || startRadius[1] > 0) {
          polygons.push(fromPoints(point(0, t0, startRadius), point(0, t1, startRadius), point(1, t0, endRadius)));
        }
        if (endRadius[0] > 0 && endRadius[1] > 0) {
          polygons.push(fromPoints(end, point(1, t0, endRadius), point(1, t1, endRadius)));
        }
        if (endRadius[0] > 0 || endRadius[1] > 0) {
          polygons.push(fromPoints(point(1, t0, endRadius), point(0, t1, startRadius), point(1, t1, endRadius)));
        }
      }
    }
    if (rotation < TAU) {
      polygons.push(fromPoints(start, point(0, 0, startRadius), end));
      polygons.push(fromPoints(point(0, 0, startRadius), point(1, 0, endRadius), end));
      polygons.push(fromPoints(start, end, point(0, 1, startRadius)));
      polygons.push(fromPoints(point(0, 1, startRadius), end, point(1, 1, endRadius)));
    }
    const result = geom32.create(polygons);
    return result;
  };
  cylinderElliptic_1 = cylinderElliptic;
  return cylinderElliptic_1;
}
var cylinder_1;
var hasRequiredCylinder;
function requireCylinder() {
  if (hasRequiredCylinder) return cylinder_1;
  hasRequiredCylinder = 1;
  const geom32 = requireGeom3();
  const cylinderElliptic = requireCylinderElliptic();
  const { isGTE } = requireCommonChecks();
  const cylinder = (options) => {
    const defaults = {
      center: [0, 0, 0],
      height: 2,
      radius: 1,
      segments: 32
    };
    const { center, height, radius: radius2, segments } = Object.assign({}, defaults, options);
    if (!isGTE(radius2, 0)) throw new Error("radius must be positive");
    if (height === 0 || radius2 === 0) return geom32.create();
    const newoptions = {
      center,
      height,
      startRadius: [radius2, radius2],
      endRadius: [radius2, radius2],
      segments
    };
    return cylinderElliptic(newoptions);
  };
  cylinder_1 = cylinder;
  return cylinder_1;
}
var ellipsoid_1;
var hasRequiredEllipsoid;
function requireEllipsoid() {
  if (hasRequiredEllipsoid) return ellipsoid_1;
  hasRequiredEllipsoid = 1;
  const { TAU } = requireConstants();
  const vec32 = requireVec3();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const { sin, cos } = requireTrigonometry();
  const { isGTE, isNumberArray } = requireCommonChecks();
  const ellipsoid = (options) => {
    const defaults = {
      center: [0, 0, 0],
      radius: [1, 1, 1],
      segments: 32,
      axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]
    };
    const { center, radius: radius2, segments, axes } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 3)) throw new Error("center must be an array of X, Y and Z values");
    if (!isNumberArray(radius2, 3)) throw new Error("radius must be an array of X, Y and Z values");
    if (!radius2.every((n) => n >= 0)) throw new Error("radius values must be positive");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    if (radius2[0] === 0 || radius2[1] === 0 || radius2[2] === 0) return geom32.create();
    const xvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), axes[0]), radius2[0]);
    const yvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), axes[1]), radius2[1]);
    const zvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), axes[2]), radius2[2]);
    const qsegments = Math.round(segments / 4);
    let prevcylinderpoint;
    const polygons = [];
    const p1 = vec32.create();
    const p2 = vec32.create();
    for (let slice1 = 0; slice1 <= segments; slice1++) {
      const angle2 = TAU * slice1 / segments;
      const cylinderpoint = vec32.add(vec32.create(), vec32.scale(p1, xvector, cos(angle2)), vec32.scale(p2, yvector, sin(angle2)));
      if (slice1 > 0) {
        let prevcospitch, prevsinpitch;
        for (let slice2 = 0; slice2 <= qsegments; slice2++) {
          const pitch = TAU / 4 * slice2 / qsegments;
          const cospitch = cos(pitch);
          const sinpitch = sin(pitch);
          if (slice2 > 0) {
            let points = [];
            let point;
            point = vec32.subtract(vec32.create(), vec32.scale(p1, prevcylinderpoint, prevcospitch), vec32.scale(p2, zvector, prevsinpitch));
            points.push(vec32.add(point, point, center));
            point = vec32.subtract(vec32.create(), vec32.scale(p1, cylinderpoint, prevcospitch), vec32.scale(p2, zvector, prevsinpitch));
            points.push(vec32.add(point, point, center));
            if (slice2 < qsegments) {
              point = vec32.subtract(vec32.create(), vec32.scale(p1, cylinderpoint, cospitch), vec32.scale(p2, zvector, sinpitch));
              points.push(vec32.add(point, point, center));
            }
            point = vec32.subtract(vec32.create(), vec32.scale(p1, prevcylinderpoint, cospitch), vec32.scale(p2, zvector, sinpitch));
            points.push(vec32.add(point, point, center));
            polygons.push(poly32.create(points));
            points = [];
            point = vec32.add(vec32.create(), vec32.scale(p1, prevcylinderpoint, prevcospitch), vec32.scale(p2, zvector, prevsinpitch));
            points.push(vec32.add(vec32.create(), center, point));
            point = vec32.add(point, vec32.scale(p1, cylinderpoint, prevcospitch), vec32.scale(p2, zvector, prevsinpitch));
            points.push(vec32.add(vec32.create(), center, point));
            if (slice2 < qsegments) {
              point = vec32.add(point, vec32.scale(p1, cylinderpoint, cospitch), vec32.scale(p2, zvector, sinpitch));
              points.push(vec32.add(vec32.create(), center, point));
            }
            point = vec32.add(point, vec32.scale(p1, prevcylinderpoint, cospitch), vec32.scale(p2, zvector, sinpitch));
            points.push(vec32.add(vec32.create(), center, point));
            points.reverse();
            polygons.push(poly32.create(points));
          }
          prevcospitch = cospitch;
          prevsinpitch = sinpitch;
        }
      }
      prevcylinderpoint = cylinderpoint;
    }
    return geom32.create(polygons);
  };
  ellipsoid_1 = ellipsoid;
  return ellipsoid_1;
}
var polyhedron_1;
var hasRequiredPolyhedron;
function requirePolyhedron() {
  if (hasRequiredPolyhedron) return polyhedron_1;
  hasRequiredPolyhedron = 1;
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const { isNumberArray } = requireCommonChecks();
  const polyhedron = (options) => {
    const defaults = {
      points: [],
      faces: [],
      colors: void 0,
      orientation: "outward"
    };
    const { points, faces, colors: colors2, orientation } = Object.assign({}, defaults, options);
    if (!(Array.isArray(points) && Array.isArray(faces))) {
      throw new Error("points and faces must be arrays");
    }
    if (points.length < 3) {
      throw new Error("three or more points are required");
    }
    if (faces.length < 1) {
      throw new Error("one or more faces are required");
    }
    if (colors2) {
      if (!Array.isArray(colors2)) {
        throw new Error("colors must be an array");
      }
      if (colors2.length !== faces.length) {
        throw new Error("faces and colors must have the same length");
      }
    }
    points.forEach((point, i) => {
      if (!isNumberArray(point, 3)) throw new Error(`point ${i} must be an array of X, Y, Z values`);
    });
    faces.forEach((face, i) => {
      if (face.length < 3) throw new Error(`face ${i} must contain 3 or more indexes`);
      if (!isNumberArray(face, face.length)) throw new Error(`face ${i} must be an array of numbers`);
    });
    if (orientation !== "outward") {
      faces.forEach((face) => face.reverse());
    }
    const polygons = faces.map((face, findex) => {
      const polygon = poly32.create(face.map((pindex) => points[pindex]));
      if (colors2 && colors2[findex]) polygon.color = colors2[findex];
      return polygon;
    });
    return geom32.create(polygons);
  };
  polyhedron_1 = polyhedron;
  return polyhedron_1;
}
var geodesicSphere_1;
var hasRequiredGeodesicSphere;
function requireGeodesicSphere() {
  if (hasRequiredGeodesicSphere) return geodesicSphere_1;
  hasRequiredGeodesicSphere = 1;
  const mat42 = requireMat4();
  const vec32 = requireVec3();
  const geom32 = requireGeom3();
  const polyhedron = requirePolyhedron();
  const { isGTE } = requireCommonChecks();
  const geodesicSphere = (options) => {
    const defaults = {
      radius: 1,
      frequency: 6
    };
    let { radius: radius2, frequency } = Object.assign({}, defaults, options);
    if (!isGTE(radius2, 0)) throw new Error("radius must be positive");
    if (!isGTE(frequency, 6)) throw new Error("frequency must be six or more");
    if (radius2 === 0) return geom32.create();
    frequency = Math.floor(frequency / 6);
    const ci = [
      // hard-coded data of icosahedron (20 faces, all triangles)
      [0.850651, 0, -0.525731],
      [0.850651, -0, 0.525731],
      [-0.850651, -0, 0.525731],
      [-0.850651, 0, -0.525731],
      [0, -0.525731, 0.850651],
      [0, 0.525731, 0.850651],
      [0, 0.525731, -0.850651],
      [0, -0.525731, -0.850651],
      [-0.525731, -0.850651, -0],
      [0.525731, -0.850651, -0],
      [0.525731, 0.850651, 0],
      [-0.525731, 0.850651, 0]
    ];
    const ti = [
      [0, 9, 1],
      [1, 10, 0],
      [6, 7, 0],
      [10, 6, 0],
      [7, 9, 0],
      [5, 1, 4],
      [4, 1, 9],
      [5, 10, 1],
      [2, 8, 3],
      [3, 11, 2],
      [2, 5, 4],
      [4, 8, 2],
      [2, 11, 5],
      [3, 7, 6],
      [6, 11, 3],
      [8, 7, 3],
      [9, 8, 4],
      [11, 10, 5],
      [10, 11, 6],
      [8, 9, 7]
    ];
    const geodesicSubDivide = (p, frequency2, offset2) => {
      const p1 = p[0];
      const p2 = p[1];
      const p3 = p[2];
      let n = offset2;
      const c = [];
      const f = [];
      for (let i = 0; i < frequency2; i++) {
        for (let j = 0; j < frequency2 - i; j++) {
          const t0 = i / frequency2;
          const t1 = (i + 1) / frequency2;
          const s0 = j / (frequency2 - i);
          const s1 = (j + 1) / (frequency2 - i);
          const s2 = frequency2 - i - 1 ? j / (frequency2 - i - 1) : 1;
          const q = [];
          q[0] = mix3(mix3(p1, p2, s0), p3, t0);
          q[1] = mix3(mix3(p1, p2, s1), p3, t0);
          q[2] = mix3(mix3(p1, p2, s2), p3, t1);
          for (let k = 0; k < 3; k++) {
            const r = vec32.length(q[k]);
            for (let l = 0; l < 3; l++) {
              q[k][l] /= r;
            }
          }
          c.push(q[0], q[1], q[2]);
          f.push([n, n + 1, n + 2]);
          n += 3;
          if (j < frequency2 - i - 1) {
            const s3 = frequency2 - i - 1 ? (j + 1) / (frequency2 - i - 1) : 1;
            q[0] = mix3(mix3(p1, p2, s1), p3, t0);
            q[1] = mix3(mix3(p1, p2, s3), p3, t1);
            q[2] = mix3(mix3(p1, p2, s2), p3, t1);
            for (let k = 0; k < 3; k++) {
              const r = vec32.length(q[k]);
              for (let l = 0; l < 3; l++) {
                q[k][l] /= r;
              }
            }
            c.push(q[0], q[1], q[2]);
            f.push([n, n + 1, n + 2]);
            n += 3;
          }
        }
      }
      return { points: c, triangles: f, offset: n };
    };
    const mix3 = (a, b, f) => {
      const _f = 1 - f;
      const c = [];
      for (let i = 0; i < 3; i++) {
        c[i] = a[i] * _f + b[i] * f;
      }
      return c;
    };
    let points = [];
    let faces = [];
    let offset = 0;
    for (let i = 0; i < ti.length; i++) {
      const g = geodesicSubDivide([ci[ti[i][0]], ci[ti[i][1]], ci[ti[i][2]]], frequency, offset);
      points = points.concat(g.points);
      faces = faces.concat(g.triangles);
      offset = g.offset;
    }
    let geometry = polyhedron({ points, faces, orientation: "inward" });
    if (radius2 !== 1) geometry = geom32.transform(mat42.fromScaling(mat42.create(), [radius2, radius2, radius2]), geometry);
    return geometry;
  };
  geodesicSphere_1 = geodesicSphere;
  return geodesicSphere_1;
}
var line_1;
var hasRequiredLine;
function requireLine() {
  if (hasRequiredLine) return line_1;
  hasRequiredLine = 1;
  const path22 = requirePath2();
  const line = (points) => {
    if (!Array.isArray(points)) throw new Error("points must be an array");
    return path22.fromPoints({}, points);
  };
  line_1 = line;
  return line_1;
}
var polygon_1;
var hasRequiredPolygon;
function requirePolygon() {
  if (hasRequiredPolygon) return polygon_1;
  hasRequiredPolygon = 1;
  const geom22 = requireGeom2();
  const polygon = (options) => {
    const defaults = {
      points: [],
      paths: [],
      orientation: "counterclockwise"
    };
    const { points, paths, orientation } = Object.assign({}, defaults, options);
    if (!(Array.isArray(points) && Array.isArray(paths))) throw new Error("points and paths must be arrays");
    let listofpolys = points;
    if (Array.isArray(points[0])) {
      if (!Array.isArray(points[0][0])) {
        listofpolys = [points];
      }
    }
    listofpolys.forEach((list, i) => {
      if (!Array.isArray(list)) throw new Error("list of points " + i + " must be an array");
      if (list.length < 3) throw new Error("list of points " + i + " must contain three or more points");
      list.forEach((point, j) => {
        if (!Array.isArray(point)) throw new Error("list of points " + i + ", point " + j + " must be an array");
        if (point.length < 2) throw new Error("list of points " + i + ", point " + j + " must contain by X and Y values");
      });
    });
    let listofpaths = paths;
    if (paths.length === 0) {
      let count = 0;
      listofpaths = listofpolys.map((list) => list.map((point) => count++));
    }
    const allpoints = [];
    listofpolys.forEach((list) => list.forEach((point) => allpoints.push(point)));
    let sides = [];
    listofpaths.forEach((path) => {
      const setofpoints = path.map((index) => allpoints[index]);
      const geometry2 = geom22.fromPoints(setofpoints);
      sides = sides.concat(geom22.toSides(geometry2));
    });
    let geometry = geom22.create(sides);
    if (orientation === "clockwise") {
      geometry = geom22.reverse(geometry);
    }
    return geometry;
  };
  polygon_1 = polygon;
  return polygon_1;
}
var rectangle_1;
var hasRequiredRectangle;
function requireRectangle() {
  if (hasRequiredRectangle) return rectangle_1;
  hasRequiredRectangle = 1;
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const { isNumberArray } = requireCommonChecks();
  const rectangle = (options) => {
    const defaults = {
      center: [0, 0],
      size: [2, 2]
    };
    const { center, size } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 2)) throw new Error("center must be an array of X and Y values");
    if (!isNumberArray(size, 2)) throw new Error("size must be an array of X and Y values");
    if (!size.every((n) => n >= 0)) throw new Error("size values must be positive");
    if (size[0] === 0 || size[1] === 0) return geom22.create();
    const point = [size[0] / 2, size[1] / 2];
    const pswap = [point[0], -point[1]];
    const points = [
      vec22.subtract(vec22.create(), center, point),
      vec22.add(vec22.create(), center, pswap),
      vec22.add(vec22.create(), center, point),
      vec22.subtract(vec22.create(), center, pswap)
    ];
    return geom22.fromPoints(points);
  };
  rectangle_1 = rectangle;
  return rectangle_1;
}
var roundedCuboid_1;
var hasRequiredRoundedCuboid;
function requireRoundedCuboid() {
  if (hasRequiredRoundedCuboid) return roundedCuboid_1;
  hasRequiredRoundedCuboid = 1;
  const { EPS, TAU } = requireConstants();
  const vec22 = requireVec2();
  const vec32 = requireVec3();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const { sin, cos } = requireTrigonometry();
  const { isGTE, isNumberArray } = requireCommonChecks();
  const cuboid = requireCuboid();
  const createCorners = (center, size, radius2, segments, slice2, positive2) => {
    const pitch = TAU / 4 * slice2 / segments;
    const cospitch = cos(pitch);
    const sinpitch = sin(pitch);
    const layersegments = segments - slice2;
    let layerradius = radius2 * cospitch;
    let layeroffset = size[2] - (radius2 - radius2 * sinpitch);
    if (!positive2) layeroffset = radius2 - radius2 * sinpitch - size[2];
    layerradius = layerradius > EPS ? layerradius : 0;
    const corner0 = vec32.add(vec32.create(), center, [size[0] - radius2, size[1] - radius2, layeroffset]);
    const corner1 = vec32.add(vec32.create(), center, [radius2 - size[0], size[1] - radius2, layeroffset]);
    const corner2 = vec32.add(vec32.create(), center, [radius2 - size[0], radius2 - size[1], layeroffset]);
    const corner3 = vec32.add(vec32.create(), center, [size[0] - radius2, radius2 - size[1], layeroffset]);
    const corner0Points = [];
    const corner1Points = [];
    const corner2Points = [];
    const corner3Points = [];
    for (let i = 0; i <= layersegments; i++) {
      const radians = layersegments > 0 ? TAU / 4 * i / layersegments : 0;
      const point2d = vec22.fromAngleRadians(vec22.create(), radians);
      vec22.scale(point2d, point2d, layerradius);
      const point3d = vec32.fromVec2(vec32.create(), point2d);
      corner0Points.push(vec32.add(vec32.create(), corner0, point3d));
      vec32.rotateZ(point3d, point3d, [0, 0, 0], TAU / 4);
      corner1Points.push(vec32.add(vec32.create(), corner1, point3d));
      vec32.rotateZ(point3d, point3d, [0, 0, 0], TAU / 4);
      corner2Points.push(vec32.add(vec32.create(), corner2, point3d));
      vec32.rotateZ(point3d, point3d, [0, 0, 0], TAU / 4);
      corner3Points.push(vec32.add(vec32.create(), corner3, point3d));
    }
    if (!positive2) {
      corner0Points.reverse();
      corner1Points.reverse();
      corner2Points.reverse();
      corner3Points.reverse();
      return [corner3Points, corner2Points, corner1Points, corner0Points];
    }
    return [corner0Points, corner1Points, corner2Points, corner3Points];
  };
  const stitchCorners = (previousCorners, currentCorners) => {
    const polygons = [];
    for (let i = 0; i < previousCorners.length; i++) {
      const previous = previousCorners[i];
      const current = currentCorners[i];
      for (let j = 0; j < previous.length - 1; j++) {
        polygons.push(poly32.create([previous[j], previous[j + 1], current[j]]));
        if (j < current.length - 1) {
          polygons.push(poly32.create([current[j], previous[j + 1], current[j + 1]]));
        }
      }
    }
    return polygons;
  };
  const stitchWalls = (previousCorners, currentCorners) => {
    const polygons = [];
    for (let i = 0; i < previousCorners.length; i++) {
      let previous = previousCorners[i];
      let current = currentCorners[i];
      const p0 = previous[previous.length - 1];
      const c0 = current[current.length - 1];
      const j = (i + 1) % previousCorners.length;
      previous = previousCorners[j];
      current = currentCorners[j];
      const p1 = previous[0];
      const c1 = current[0];
      polygons.push(poly32.create([p0, p1, c1, c0]));
    }
    return polygons;
  };
  const stitchSides = (bottomCorners, topCorners) => {
    bottomCorners = [bottomCorners[3], bottomCorners[2], bottomCorners[1], bottomCorners[0]];
    bottomCorners = bottomCorners.map((corner) => corner.slice().reverse());
    const bottomPoints = [];
    bottomCorners.forEach((corner) => {
      corner.forEach((point) => bottomPoints.push(point));
    });
    const topPoints = [];
    topCorners.forEach((corner) => {
      corner.forEach((point) => topPoints.push(point));
    });
    const polygons = [];
    for (let i = 0; i < topPoints.length; i++) {
      const j = (i + 1) % topPoints.length;
      polygons.push(poly32.create([bottomPoints[i], bottomPoints[j], topPoints[j], topPoints[i]]));
    }
    return polygons;
  };
  const roundedCuboid = (options) => {
    const defaults = {
      center: [0, 0, 0],
      size: [2, 2, 2],
      roundRadius: 0.2,
      segments: 32
    };
    let { center, size, roundRadius, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 3)) throw new Error("center must be an array of X, Y and Z values");
    if (!isNumberArray(size, 3)) throw new Error("size must be an array of X, Y and Z values");
    if (!size.every((n) => n >= 0)) throw new Error("size values must be positive");
    if (!isGTE(roundRadius, 0)) throw new Error("roundRadius must be positive");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    if (size[0] === 0 || size[1] === 0 || size[2] === 0) return geom32.create();
    if (roundRadius === 0) return cuboid({ center, size });
    size = size.map((v) => v / 2);
    if (roundRadius > size[0] - EPS || roundRadius > size[1] - EPS || roundRadius > size[2] - EPS) throw new Error("roundRadius must be smaller than the radius of all dimensions");
    segments = Math.floor(segments / 4);
    let prevCornersPos = null;
    let prevCornersNeg = null;
    let polygons = [];
    for (let slice2 = 0; slice2 <= segments; slice2++) {
      const cornersPos = createCorners(center, size, roundRadius, segments, slice2, true);
      const cornersNeg = createCorners(center, size, roundRadius, segments, slice2, false);
      if (slice2 === 0) {
        polygons = polygons.concat(stitchSides(cornersNeg, cornersPos));
      }
      if (prevCornersPos) {
        polygons = polygons.concat(
          stitchCorners(prevCornersPos, cornersPos),
          stitchWalls(prevCornersPos, cornersPos)
        );
      }
      if (prevCornersNeg) {
        polygons = polygons.concat(
          stitchCorners(prevCornersNeg, cornersNeg),
          stitchWalls(prevCornersNeg, cornersNeg)
        );
      }
      if (slice2 === segments) {
        let points = cornersPos.map((corner) => corner[0]);
        polygons.push(poly32.create(points));
        points = cornersNeg.map((corner) => corner[0]);
        polygons.push(poly32.create(points));
      }
      prevCornersPos = cornersPos;
      prevCornersNeg = cornersNeg;
    }
    return geom32.create(polygons);
  };
  roundedCuboid_1 = roundedCuboid;
  return roundedCuboid_1;
}
var roundedCylinder_1;
var hasRequiredRoundedCylinder;
function requireRoundedCylinder() {
  if (hasRequiredRoundedCylinder) return roundedCylinder_1;
  hasRequiredRoundedCylinder = 1;
  const { EPS, TAU } = requireConstants();
  const vec32 = requireVec3();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const { sin, cos } = requireTrigonometry();
  const { isGTE, isNumberArray } = requireCommonChecks();
  const cylinder = requireCylinder();
  const roundedCylinder = (options) => {
    const defaults = {
      center: [0, 0, 0],
      height: 2,
      radius: 1,
      roundRadius: 0.2,
      segments: 32
    };
    const { center, height, radius: radius2, roundRadius, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 3)) throw new Error("center must be an array of X, Y and Z values");
    if (!isGTE(height, 0)) throw new Error("height must be positive");
    if (!isGTE(radius2, 0)) throw new Error("radius must be positive");
    if (!isGTE(roundRadius, 0)) throw new Error("roundRadius must be positive");
    if (roundRadius > radius2) throw new Error("roundRadius must be smaller than the radius");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    if (height === 0 || radius2 === 0) return geom32.create();
    if (roundRadius === 0) return cylinder({ center, height, radius: radius2 });
    const start = [0, 0, -(height / 2)];
    const end = [0, 0, height / 2];
    const direction = vec32.subtract(vec32.create(), end, start);
    const length = vec32.length(direction);
    if (2 * roundRadius > length - EPS) throw new Error("height must be larger than twice roundRadius");
    let defaultnormal;
    if (Math.abs(direction[0]) > Math.abs(direction[1])) {
      defaultnormal = vec32.fromValues(0, 1, 0);
    } else {
      defaultnormal = vec32.fromValues(1, 0, 0);
    }
    const zvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), direction), roundRadius);
    const xvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), vec32.cross(vec32.create(), zvector, defaultnormal)), radius2);
    const yvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), vec32.cross(vec32.create(), xvector, zvector)), radius2);
    vec32.add(start, start, zvector);
    vec32.subtract(end, end, zvector);
    const qsegments = Math.floor(0.25 * segments);
    const fromPoints = (points) => {
      const newpoints = points.map((point) => vec32.add(point, point, center));
      return poly32.create(newpoints);
    };
    const polygons = [];
    const v1 = vec32.create();
    const v22 = vec32.create();
    let prevcylinderpoint;
    for (let slice1 = 0; slice1 <= segments; slice1++) {
      const angle2 = TAU * slice1 / segments;
      const cylinderpoint = vec32.add(vec32.create(), vec32.scale(v1, xvector, cos(angle2)), vec32.scale(v22, yvector, sin(angle2)));
      if (slice1 > 0) {
        let points = [];
        points.push(vec32.add(vec32.create(), start, cylinderpoint));
        points.push(vec32.add(vec32.create(), start, prevcylinderpoint));
        points.push(vec32.add(vec32.create(), end, prevcylinderpoint));
        points.push(vec32.add(vec32.create(), end, cylinderpoint));
        polygons.push(fromPoints(points));
        let prevcospitch, prevsinpitch;
        for (let slice2 = 0; slice2 <= qsegments; slice2++) {
          const pitch = TAU / 4 * slice2 / qsegments;
          const cospitch = cos(pitch);
          const sinpitch = sin(pitch);
          if (slice2 > 0) {
            points = [];
            let point;
            point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, prevcylinderpoint, prevcospitch), vec32.scale(v22, zvector, prevsinpitch)));
            points.push(point);
            point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, cylinderpoint, prevcospitch), vec32.scale(v22, zvector, prevsinpitch)));
            points.push(point);
            if (slice2 < qsegments) {
              point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, cylinderpoint, cospitch), vec32.scale(v22, zvector, sinpitch)));
              points.push(point);
            }
            point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, prevcylinderpoint, cospitch), vec32.scale(v22, zvector, sinpitch)));
            points.push(point);
            polygons.push(fromPoints(points));
            points = [];
            point = vec32.add(vec32.create(), vec32.scale(v1, prevcylinderpoint, prevcospitch), vec32.scale(v22, zvector, prevsinpitch));
            vec32.add(point, point, end);
            points.push(point);
            point = vec32.add(vec32.create(), vec32.scale(v1, cylinderpoint, prevcospitch), vec32.scale(v22, zvector, prevsinpitch));
            vec32.add(point, point, end);
            points.push(point);
            if (slice2 < qsegments) {
              point = vec32.add(vec32.create(), vec32.scale(v1, cylinderpoint, cospitch), vec32.scale(v22, zvector, sinpitch));
              vec32.add(point, point, end);
              points.push(point);
            }
            point = vec32.add(vec32.create(), vec32.scale(v1, prevcylinderpoint, cospitch), vec32.scale(v22, zvector, sinpitch));
            vec32.add(point, point, end);
            points.push(point);
            points.reverse();
            polygons.push(fromPoints(points));
          }
          prevcospitch = cospitch;
          prevsinpitch = sinpitch;
        }
      }
      prevcylinderpoint = cylinderpoint;
    }
    const result = geom32.create(polygons);
    return result;
  };
  roundedCylinder_1 = roundedCylinder;
  return roundedCylinder_1;
}
var roundedRectangle_1;
var hasRequiredRoundedRectangle;
function requireRoundedRectangle() {
  if (hasRequiredRoundedRectangle) return roundedRectangle_1;
  hasRequiredRoundedRectangle = 1;
  const { EPS, TAU } = requireConstants();
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const { isGTE, isNumberArray } = requireCommonChecks();
  const rectangle = requireRectangle();
  const roundedRectangle = (options) => {
    const defaults = {
      center: [0, 0],
      size: [2, 2],
      roundRadius: 0.2,
      segments: 32
    };
    let { center, size, roundRadius, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 2)) throw new Error("center must be an array of X and Y values");
    if (!isNumberArray(size, 2)) throw new Error("size must be an array of X and Y values");
    if (!size.every((n) => n >= 0)) throw new Error("size values must be positive");
    if (!isGTE(roundRadius, 0)) throw new Error("roundRadius must be positive");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    if (size[0] === 0 || size[1] === 0) return geom22.create();
    if (roundRadius === 0) return rectangle({ center, size });
    size = size.map((v) => v / 2);
    if (roundRadius > size[0] - EPS || roundRadius > size[1] - EPS) throw new Error("roundRadius must be smaller than the radius of all dimensions");
    const cornersegments = Math.floor(segments / 4);
    const corner0 = vec22.add(vec22.create(), center, [size[0] - roundRadius, size[1] - roundRadius]);
    const corner1 = vec22.add(vec22.create(), center, [roundRadius - size[0], size[1] - roundRadius]);
    const corner2 = vec22.add(vec22.create(), center, [roundRadius - size[0], roundRadius - size[1]]);
    const corner3 = vec22.add(vec22.create(), center, [size[0] - roundRadius, roundRadius - size[1]]);
    const corner0Points = [];
    const corner1Points = [];
    const corner2Points = [];
    const corner3Points = [];
    for (let i = 0; i <= cornersegments; i++) {
      const radians = TAU / 4 * i / cornersegments;
      const point = vec22.fromAngleRadians(vec22.create(), radians);
      vec22.scale(point, point, roundRadius);
      corner0Points.push(vec22.add(vec22.create(), corner0, point));
      vec22.rotate(point, point, vec22.create(), TAU / 4);
      corner1Points.push(vec22.add(vec22.create(), corner1, point));
      vec22.rotate(point, point, vec22.create(), TAU / 4);
      corner2Points.push(vec22.add(vec22.create(), corner2, point));
      vec22.rotate(point, point, vec22.create(), TAU / 4);
      corner3Points.push(vec22.add(vec22.create(), corner3, point));
    }
    return geom22.fromPoints(corner0Points.concat(corner1Points, corner2Points, corner3Points));
  };
  roundedRectangle_1 = roundedRectangle;
  return roundedRectangle_1;
}
var sphere_1;
var hasRequiredSphere;
function requireSphere() {
  if (hasRequiredSphere) return sphere_1;
  hasRequiredSphere = 1;
  const ellipsoid = requireEllipsoid();
  const { isGTE } = requireCommonChecks();
  const sphere = (options) => {
    const defaults = {
      center: [0, 0, 0],
      radius: 1,
      segments: 32,
      axes: [[1, 0, 0], [0, -1, 0], [0, 0, 1]]
    };
    let { center, radius: radius2, segments, axes } = Object.assign({}, defaults, options);
    if (!isGTE(radius2, 0)) throw new Error("radius must be positive");
    radius2 = [radius2, radius2, radius2];
    return ellipsoid({ center, radius: radius2, segments, axes });
  };
  sphere_1 = sphere;
  return sphere_1;
}
var square_1;
var hasRequiredSquare;
function requireSquare() {
  if (hasRequiredSquare) return square_1;
  hasRequiredSquare = 1;
  const rectangle = requireRectangle();
  const { isGTE } = requireCommonChecks();
  const square = (options) => {
    const defaults = {
      center: [0, 0],
      size: 2
    };
    let { center, size } = Object.assign({}, defaults, options);
    if (!isGTE(size, 0)) throw new Error("size must be positive");
    size = [size, size];
    return rectangle({ center, size });
  };
  square_1 = square;
  return square_1;
}
var star_1;
var hasRequiredStar;
function requireStar() {
  if (hasRequiredStar) return star_1;
  hasRequiredStar = 1;
  const { TAU } = requireConstants();
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const { isGT, isGTE, isNumberArray } = requireCommonChecks();
  const getRadiusRatio = (vertices, density) => {
    if (vertices > 0 && density > 1 && density < vertices / 2) {
      return Math.cos(Math.PI * density / vertices) / Math.cos(Math.PI * (density - 1) / vertices);
    }
    return 0;
  };
  const getPoints = (vertices, radius2, startAngle, center) => {
    const a = TAU / vertices;
    const points = [];
    for (let i = 0; i < vertices; i++) {
      const point = vec22.fromAngleRadians(vec22.create(), a * i + startAngle);
      vec22.scale(point, point, radius2);
      vec22.add(point, center, point);
      points.push(point);
    }
    return points;
  };
  const star = (options) => {
    const defaults = {
      center: [0, 0],
      vertices: 5,
      outerRadius: 1,
      innerRadius: 0,
      density: 2,
      startAngle: 0
    };
    let { center, vertices, outerRadius, innerRadius, density, startAngle } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 2)) throw new Error("center must be an array of X and Y values");
    if (!isGTE(vertices, 2)) throw new Error("vertices must be two or more");
    if (!isGT(outerRadius, 0)) throw new Error("outerRadius must be greater than zero");
    if (!isGTE(innerRadius, 0)) throw new Error("innerRadius must be greater than zero");
    if (!isGTE(startAngle, 0)) throw new Error("startAngle must be greater than zero");
    vertices = Math.floor(vertices);
    density = Math.floor(density);
    startAngle = startAngle % TAU;
    if (innerRadius === 0) {
      if (!isGTE(density, 2)) throw new Error("density must be two or more");
      innerRadius = outerRadius * getRadiusRatio(vertices, density);
    }
    const centerv = vec22.clone(center);
    const outerPoints = getPoints(vertices, outerRadius, startAngle, centerv);
    const innerPoints = getPoints(vertices, innerRadius, startAngle + Math.PI / vertices, centerv);
    const allPoints = [];
    for (let i = 0; i < vertices; i++) {
      allPoints.push(outerPoints[i]);
      allPoints.push(innerPoints[i]);
    }
    return geom22.fromPoints(allPoints);
  };
  star_1 = star;
  return star_1;
}
var mirror_1;
var hasRequiredMirror;
function requireMirror() {
  if (hasRequiredMirror) return mirror_1;
  hasRequiredMirror = 1;
  const flatten = requireFlatten();
  const mat42 = requireMat4();
  const plane2 = requirePlane$1();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const mirror = (options, ...objects) => {
    const defaults = {
      origin: [0, 0, 0],
      normal: [0, 0, 1]
      // Z axis
    };
    const { origin, normal } = Object.assign({}, defaults, options);
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    const planeOfMirror = plane2.fromNormalAndPoint(plane2.create(), normal, origin);
    if (Number.isNaN(planeOfMirror[0])) {
      throw new Error("the given origin and normal do not define a proper plane");
    }
    const matrix = mat42.mirrorByPlane(mat42.create(), planeOfMirror);
    const results = objects.map((object) => {
      if (path22.isA(object)) return path22.transform(matrix, object);
      if (geom22.isA(object)) return geom22.transform(matrix, object);
      if (geom32.isA(object)) return geom32.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const mirrorX = (...objects) => mirror({ normal: [1, 0, 0] }, objects);
  const mirrorY = (...objects) => mirror({ normal: [0, 1, 0] }, objects);
  const mirrorZ = (...objects) => mirror({ normal: [0, 0, 1] }, objects);
  mirror_1 = {
    mirror,
    mirrorX,
    mirrorY,
    mirrorZ
  };
  return mirror_1;
}
var calculatePlane_1;
var hasRequiredCalculatePlane;
function requireCalculatePlane() {
  if (hasRequiredCalculatePlane) return calculatePlane_1;
  hasRequiredCalculatePlane = 1;
  const plane2 = requirePlane$1();
  const vec32 = requireVec3();
  const calculatePlane = (slice2) => {
    const edges = slice2.edges;
    if (edges.length < 3) throw new Error("slices must have 3 or more edges to calculate a plane");
    const midpoint = edges.reduce((point, edge) => vec32.add(vec32.create(), point, edge[0]), vec32.create());
    vec32.scale(midpoint, midpoint, 1 / edges.length);
    let farthestEdge;
    let distance = 0;
    edges.forEach((edge) => {
      if (!vec32.equals(edge[0], edge[1])) {
        const d = vec32.squaredDistance(midpoint, edge[0]);
        if (d > distance) {
          farthestEdge = edge;
          distance = d;
        }
      }
    });
    const beforeEdge = edges.find((edge) => vec32.equals(edge[1], farthestEdge[0]));
    return plane2.fromPoints(plane2.create(), beforeEdge[0], farthestEdge[0], farthestEdge[1]);
  };
  calculatePlane_1 = calculatePlane;
  return calculatePlane_1;
}
var create_1;
var hasRequiredCreate;
function requireCreate() {
  if (hasRequiredCreate) return create_1;
  hasRequiredCreate = 1;
  const create = (edges) => {
    if (!edges) {
      edges = [];
    }
    return { edges };
  };
  create_1 = create;
  return create_1;
}
var clone_1;
var hasRequiredClone;
function requireClone() {
  if (hasRequiredClone) return clone_1;
  hasRequiredClone = 1;
  const create = requireCreate();
  const vec32 = requireVec3();
  const clone = (...params) => {
    let out;
    let slice2;
    if (params.length === 1) {
      out = create();
      slice2 = params[0];
    } else {
      out = params[0];
      slice2 = params[1];
    }
    out.edges = slice2.edges.map((edge) => [vec32.clone(edge[0]), vec32.clone(edge[1])]);
    return out;
  };
  clone_1 = clone;
  return clone_1;
}
var equals_1;
var hasRequiredEquals;
function requireEquals() {
  if (hasRequiredEquals) return equals_1;
  hasRequiredEquals = 1;
  const vec32 = requireVec3();
  const equals = (a, b) => {
    const aedges = a.edges;
    const bedges = b.edges;
    if (aedges.length !== bedges.length) {
      return false;
    }
    const isEqual = aedges.reduce((acc, aedge, i) => {
      const bedge = bedges[i];
      const d = vec32.squaredDistance(aedge[0], bedge[0]);
      return acc && d < Number.EPSILON;
    }, true);
    return isEqual;
  };
  equals_1 = equals;
  return equals_1;
}
var fromPoints_1;
var hasRequiredFromPoints;
function requireFromPoints() {
  if (hasRequiredFromPoints) return fromPoints_1;
  hasRequiredFromPoints = 1;
  const vec32 = requireVec3();
  const create = requireCreate();
  const fromPoints = (points) => {
    if (!Array.isArray(points)) throw new Error("the given points must be an array");
    if (points.length < 3) throw new Error("the given points must contain THREE or more points");
    const edges = [];
    let prevpoint = points[points.length - 1];
    points.forEach((point) => {
      if (point.length === 2) edges.push([vec32.fromVec2(vec32.create(), prevpoint), vec32.fromVec2(vec32.create(), point)]);
      if (point.length === 3) edges.push([prevpoint, point]);
      prevpoint = point;
    });
    return create(edges);
  };
  fromPoints_1 = fromPoints;
  return fromPoints_1;
}
var fromSides_1;
var hasRequiredFromSides;
function requireFromSides() {
  if (hasRequiredFromSides) return fromSides_1;
  hasRequiredFromSides = 1;
  const vec32 = requireVec3();
  const create = requireCreate();
  const fromSides = (sides) => {
    if (!Array.isArray(sides)) throw new Error("the given sides must be an array");
    const edges = [];
    sides.forEach((side) => {
      edges.push([vec32.fromVec2(vec32.create(), side[0]), vec32.fromVec2(vec32.create(), side[1])]);
    });
    return create(edges);
  };
  fromSides_1 = fromSides;
  return fromSides_1;
}
var isA_1;
var hasRequiredIsA;
function requireIsA() {
  if (hasRequiredIsA) return isA_1;
  hasRequiredIsA = 1;
  const isA = (object) => {
    if (object && typeof object === "object") {
      if ("edges" in object) {
        if (Array.isArray(object.edges)) {
          return true;
        }
      }
    }
    return false;
  };
  isA_1 = isA;
  return isA_1;
}
var reverse_1;
var hasRequiredReverse;
function requireReverse() {
  if (hasRequiredReverse) return reverse_1;
  hasRequiredReverse = 1;
  const create = requireCreate();
  const reverse = (...params) => {
    let out;
    let slice2;
    if (params.length === 1) {
      out = create();
      slice2 = params[0];
    } else {
      out = params[0];
      slice2 = params[1];
    }
    out.edges = slice2.edges.map((edge) => [edge[1], edge[0]]);
    return out;
  };
  reverse_1 = reverse;
  return reverse_1;
}
var toEdges_1;
var hasRequiredToEdges;
function requireToEdges() {
  if (hasRequiredToEdges) return toEdges_1;
  hasRequiredToEdges = 1;
  const toEdges = (slice2) => slice2.edges;
  toEdges_1 = toEdges;
  return toEdges_1;
}
var linkedListSort;
var hasRequiredLinkedListSort;
function requireLinkedListSort() {
  if (hasRequiredLinkedListSort) return linkedListSort;
  hasRequiredLinkedListSort = 1;
  const sortLinked = (list, fn) => {
    let i, p, q, e, numMerges;
    let inSize = 1;
    do {
      p = list;
      list = null;
      let tail = null;
      numMerges = 0;
      while (p) {
        numMerges++;
        q = p;
        let pSize = 0;
        for (i = 0; i < inSize; i++) {
          pSize++;
          q = q.nextZ;
          if (!q) break;
        }
        let qSize = inSize;
        while (pSize > 0 || qSize > 0 && q) {
          if (pSize !== 0 && (qSize === 0 || !q || fn(p) <= fn(q))) {
            e = p;
            p = p.nextZ;
            pSize--;
          } else {
            e = q;
            q = q.nextZ;
            qSize--;
          }
          if (tail) tail.nextZ = e;
          else list = e;
          e.prevZ = tail;
          tail = e;
        }
        p = q;
      }
      tail.nextZ = null;
      inSize *= 2;
    } while (numMerges > 1);
    return list;
  };
  linkedListSort = sortLinked;
  return linkedListSort;
}
var linkedList;
var hasRequiredLinkedList;
function requireLinkedList() {
  if (hasRequiredLinkedList) return linkedList;
  hasRequiredLinkedList = 1;
  const sortLinked = requireLinkedListSort();
  class Node {
    constructor(i, x, y) {
      this.i = i;
      this.x = x;
      this.y = y;
      this.prev = null;
      this.next = null;
      this.z = null;
      this.prevZ = null;
      this.nextZ = null;
      this.steiner = false;
    }
  }
  const insertNode = (i, x, y, last) => {
    const p = new Node(i, x, y);
    if (!last) {
      p.prev = p;
      p.next = p;
    } else {
      p.next = last.next;
      p.prev = last;
      last.next.prev = p;
      last.next = p;
    }
    return p;
  };
  const removeNode = (p) => {
    p.next.prev = p.prev;
    p.prev.next = p.next;
    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
  };
  linkedList = { Node, insertNode, removeNode, sortLinked };
  return linkedList;
}
var triangle;
var hasRequiredTriangle$1;
function requireTriangle$1() {
  if (hasRequiredTriangle$1) return triangle;
  hasRequiredTriangle$1 = 1;
  const pointInTriangle = (ax, ay, bx, by, cx, cy, px, py) => (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 && (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 && (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
  const area = (p, q, r) => (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  triangle = { area, pointInTriangle };
  return triangle;
}
var linkedPolygon_1;
var hasRequiredLinkedPolygon;
function requireLinkedPolygon() {
  if (hasRequiredLinkedPolygon) return linkedPolygon_1;
  hasRequiredLinkedPolygon = 1;
  const { Node, insertNode, removeNode } = requireLinkedList();
  const { area } = requireTriangle$1();
  const linkedPolygon = (data, start, end, dim, clockwise) => {
    let last;
    if (clockwise === signedArea2(data, start, end, dim) > 0) {
      for (let i = start; i < end; i += dim) {
        last = insertNode(i, data[i], data[i + 1], last);
      }
    } else {
      for (let i = end - dim; i >= start; i -= dim) {
        last = insertNode(i, data[i], data[i + 1], last);
      }
    }
    if (last && equals(last, last.next)) {
      removeNode(last);
      last = last.next;
    }
    return last;
  };
  const filterPoints = (start, end) => {
    if (!start) return start;
    if (!end) end = start;
    let p = start;
    let again;
    do {
      again = false;
      if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
        removeNode(p);
        p = end = p.prev;
        if (p === p.next) break;
        again = true;
      } else {
        p = p.next;
      }
    } while (again || p !== end);
    return end;
  };
  const cureLocalIntersections = (start, triangles, dim) => {
    let p = start;
    do {
      const a = p.prev;
      const b = p.next.next;
      if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
        triangles.push(a.i / dim);
        triangles.push(p.i / dim);
        triangles.push(b.i / dim);
        removeNode(p);
        removeNode(p.next);
        p = start = b;
      }
      p = p.next;
    } while (p !== start);
    return filterPoints(p);
  };
  const intersectsPolygon = (a, b) => {
    let p = a;
    do {
      if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
      p = p.next;
    } while (p !== a);
    return false;
  };
  const locallyInside = (a, b) => area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
  const middleInside = (a, b) => {
    let p = a;
    let inside2 = false;
    const px = (a.x + b.x) / 2;
    const py = (a.y + b.y) / 2;
    do {
      if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) {
        inside2 = !inside2;
      }
      p = p.next;
    } while (p !== a);
    return inside2;
  };
  const splitPolygon = (a, b) => {
    const a2 = new Node(a.i, a.x, a.y);
    const b2 = new Node(b.i, b.x, b.y);
    const an = a.next;
    const bp = b.prev;
    a.next = b;
    b.prev = a;
    a2.next = an;
    an.prev = a2;
    b2.next = a2;
    a2.prev = b2;
    bp.next = b2;
    b2.prev = bp;
    return b2;
  };
  const isValidDiagonal = (a, b) => a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // doesn't intersect other edges
  (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
  (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
  equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
  const intersects = (p1, q1, p2, q2) => {
    const o1 = Math.sign(area(p1, q1, p2));
    const o2 = Math.sign(area(p1, q1, q2));
    const o3 = Math.sign(area(p2, q2, p1));
    const o4 = Math.sign(area(p2, q2, q1));
    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;
    return false;
  };
  const onSegment = (p, q, r) => q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
  const signedArea2 = (data, start, end, dim) => {
    let sum = 0;
    for (let i = start, j = end - dim; i < end; i += dim) {
      sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
      j = i;
    }
    return sum;
  };
  const equals = (p1, p2) => p1.x === p2.x && p1.y === p2.y;
  linkedPolygon_1 = { cureLocalIntersections, filterPoints, isValidDiagonal, linkedPolygon, locallyInside, splitPolygon };
  return linkedPolygon_1;
}
var eliminateHoles_1;
var hasRequiredEliminateHoles;
function requireEliminateHoles() {
  if (hasRequiredEliminateHoles) return eliminateHoles_1;
  hasRequiredEliminateHoles = 1;
  const { filterPoints, linkedPolygon, locallyInside, splitPolygon } = requireLinkedPolygon();
  const { area, pointInTriangle } = requireTriangle$1();
  const eliminateHoles = (data, holeIndices, outerNode, dim) => {
    const queue = [];
    for (let i = 0, len = holeIndices.length; i < len; i++) {
      const start = holeIndices[i] * dim;
      const end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
      const list = linkedPolygon(data, start, end, dim, false);
      if (list === list.next) list.steiner = true;
      queue.push(getLeftmost(list));
    }
    queue.sort((a, b) => a.x - b.x);
    for (let i = 0; i < queue.length; i++) {
      outerNode = eliminateHole(queue[i], outerNode);
      outerNode = filterPoints(outerNode, outerNode.next);
    }
    return outerNode;
  };
  const eliminateHole = (hole, outerNode) => {
    const bridge = findHoleBridge(hole, outerNode);
    if (!bridge) {
      return outerNode;
    }
    const bridgeReverse = splitPolygon(bridge, hole);
    const filteredBridge = filterPoints(bridge, bridge.next);
    filterPoints(bridgeReverse, bridgeReverse.next);
    return outerNode === bridge ? filteredBridge : outerNode;
  };
  const findHoleBridge = (hole, outerNode) => {
    let p = outerNode;
    const hx = hole.x;
    const hy = hole.y;
    let qx = -Infinity;
    let m;
    do {
      if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
        const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
        if (x <= hx && x > qx) {
          qx = x;
          if (x === hx) {
            if (hy === p.y) return p;
            if (hy === p.next.y) return p.next;
          }
          m = p.x < p.next.x ? p : p.next;
        }
      }
      p = p.next;
    } while (p !== outerNode);
    if (!m) return null;
    if (hx === qx) return m;
    const stop = m;
    const mx = m.x;
    const my = m.y;
    let tanMin = Infinity;
    p = m;
    do {
      if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
        const tan = Math.abs(hy - p.y) / (hx - p.x);
        if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
          m = p;
          tanMin = tan;
        }
      }
      p = p.next;
    } while (p !== stop);
    return m;
  };
  const sectorContainsSector = (m, p) => area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
  const getLeftmost = (start) => {
    let p = start;
    let leftmost = start;
    do {
      if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
      p = p.next;
    } while (p !== start);
    return leftmost;
  };
  eliminateHoles_1 = eliminateHoles;
  return eliminateHoles_1;
}
var earcut;
var hasRequiredEarcut;
function requireEarcut() {
  if (hasRequiredEarcut) return earcut;
  hasRequiredEarcut = 1;
  const eliminateHoles = requireEliminateHoles();
  const { removeNode, sortLinked } = requireLinkedList();
  const { cureLocalIntersections, filterPoints, isValidDiagonal, linkedPolygon, splitPolygon } = requireLinkedPolygon();
  const { area, pointInTriangle } = requireTriangle$1();
  const triangulate = (data, holeIndices, dim = 2) => {
    const hasHoles = holeIndices && holeIndices.length;
    const outerLen = hasHoles ? holeIndices[0] * dim : data.length;
    let outerNode = linkedPolygon(data, 0, outerLen, dim, true);
    const triangles = [];
    if (!outerNode || outerNode.next === outerNode.prev) return triangles;
    let minX, minY, maxX, maxY, invSize;
    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
    if (data.length > 80 * dim) {
      minX = maxX = data[0];
      minY = maxY = data[1];
      for (let i = dim; i < outerLen; i += dim) {
        const x = data[i];
        const y = data[i + 1];
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
      invSize = Math.max(maxX - minX, maxY - minY);
      invSize = invSize !== 0 ? 1 / invSize : 0;
    }
    earcutLinked(outerNode, triangles, dim, minX, minY, invSize);
    return triangles;
  };
  const earcutLinked = (ear, triangles, dim, minX, minY, invSize, pass) => {
    if (!ear) return;
    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
    let stop = ear;
    let prev;
    let next;
    while (ear.prev !== ear.next) {
      prev = ear.prev;
      next = ear.next;
      if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
        triangles.push(prev.i / dim);
        triangles.push(ear.i / dim);
        triangles.push(next.i / dim);
        removeNode(ear);
        ear = next.next;
        stop = next.next;
        continue;
      }
      ear = next;
      if (ear === stop) {
        if (!pass) {
          earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
        } else if (pass === 1) {
          ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
          earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
        } else if (pass === 2) {
          splitEarcut(ear, triangles, dim, minX, minY, invSize);
        }
        break;
      }
    }
  };
  const isEar = (ear) => {
    const a = ear.prev;
    const b = ear;
    const c = ear.next;
    if (area(a, b, c) >= 0) return false;
    let p = ear.next.next;
    while (p !== ear.prev) {
      if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) {
        return false;
      }
      p = p.next;
    }
    return true;
  };
  const isEarHashed = (ear, minX, minY, invSize) => {
    const a = ear.prev;
    const b = ear;
    const c = ear.next;
    if (area(a, b, c) >= 0) return false;
    const minTX = a.x < b.x ? a.x < c.x ? a.x : c.x : b.x < c.x ? b.x : c.x;
    const minTY = a.y < b.y ? a.y < c.y ? a.y : c.y : b.y < c.y ? b.y : c.y;
    const maxTX = a.x > b.x ? a.x > c.x ? a.x : c.x : b.x > c.x ? b.x : c.x;
    const maxTY = a.y > b.y ? a.y > c.y ? a.y : c.y : b.y > c.y ? b.y : c.y;
    const minZ = zOrder(minTX, minTY, minX, minY, invSize);
    const maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);
    let p = ear.prevZ;
    let n = ear.nextZ;
    while (p && p.z >= minZ && n && n.z <= maxZ) {
      if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
      p = p.prevZ;
      if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
      n = n.nextZ;
    }
    while (p && p.z >= minZ) {
      if (p !== ear.prev && p !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
      p = p.prevZ;
    }
    while (n && n.z <= maxZ) {
      if (n !== ear.prev && n !== ear.next && pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
      n = n.nextZ;
    }
    return true;
  };
  const splitEarcut = (start, triangles, dim, minX, minY, invSize) => {
    let a = start;
    do {
      let b = a.next.next;
      while (b !== a.prev) {
        if (a.i !== b.i && isValidDiagonal(a, b)) {
          let c = splitPolygon(a, b);
          a = filterPoints(a, a.next);
          c = filterPoints(c, c.next);
          earcutLinked(a, triangles, dim, minX, minY, invSize);
          earcutLinked(c, triangles, dim, minX, minY, invSize);
          return;
        }
        b = b.next;
      }
      a = a.next;
    } while (a !== start);
  };
  const indexCurve = (start, minX, minY, invSize) => {
    let p = start;
    do {
      if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
      p.prevZ = p.prev;
      p.nextZ = p.next;
      p = p.next;
    } while (p !== start);
    p.prevZ.nextZ = null;
    p.prevZ = null;
    sortLinked(p, (p2) => p2.z);
  };
  const zOrder = (x, y, minX, minY, invSize) => {
    x = 32767 * (x - minX) * invSize;
    y = 32767 * (y - minY) * invSize;
    x = (x | x << 8) & 16711935;
    x = (x | x << 4) & 252645135;
    x = (x | x << 2) & 858993459;
    x = (x | x << 1) & 1431655765;
    y = (y | y << 8) & 16711935;
    y = (y | y << 4) & 252645135;
    y = (y | y << 2) & 858993459;
    y = (y | y << 1) & 1431655765;
    return x | y << 1;
  };
  earcut = triangulate;
  return earcut;
}
var assignHoles_1;
var hasRequiredAssignHoles;
function requireAssignHoles() {
  if (hasRequiredAssignHoles) return assignHoles_1;
  hasRequiredAssignHoles = 1;
  const { area } = requireUtils$1();
  const { toOutlines } = requireGeom2();
  const { arePointsInside } = requirePoly2();
  const assignHoles = (geometry) => {
    const outlines = toOutlines(geometry);
    const solids = [];
    const holes = [];
    outlines.forEach((outline, i) => {
      const a = area(outline);
      if (a < 0) {
        holes.push(i);
      } else if (a > 0) {
        solids.push(i);
      }
    });
    const children2 = [];
    const parents = [];
    solids.forEach((s, i) => {
      const solid = outlines[s];
      children2[i] = [];
      holes.forEach((h, j) => {
        const hole = outlines[h];
        if (arePointsInside([hole[0]], { vertices: solid })) {
          children2[i].push(h);
          if (!parents[j]) parents[j] = [];
          parents[j].push(i);
        }
      });
    });
    holes.forEach((h, j) => {
      if (parents[j] && parents[j].length > 1) {
        const directParent = minIndex(parents[j], (p) => children2[p].length);
        parents[j].forEach((p, i) => {
          if (i !== directParent) {
            children2[p] = children2[p].filter((c) => c !== h);
          }
        });
      }
    });
    return children2.map((holes2, i) => ({
      solid: outlines[solids[i]],
      holes: holes2.map((h) => outlines[h])
    }));
  };
  const minIndex = (list, score) => {
    let bestIndex;
    let best;
    list.forEach((item, index) => {
      const value = score(item);
      if (best === void 0 || value < best) {
        bestIndex = index;
        best = value;
      }
    });
    return bestIndex;
  };
  assignHoles_1 = assignHoles;
  return assignHoles_1;
}
var polygonHierarchy;
var hasRequiredPolygonHierarchy;
function requirePolygonHierarchy() {
  if (hasRequiredPolygonHierarchy) return polygonHierarchy;
  hasRequiredPolygonHierarchy = 1;
  const geom22 = requireGeom2();
  const plane2 = requirePlane$1();
  const vec22 = requireVec2();
  const vec32 = requireVec3();
  const calculatePlane = requireCalculatePlane();
  const assignHoles = requireAssignHoles();
  class PolygonHierarchy {
    constructor(slice2) {
      this.plane = calculatePlane(slice2);
      const rightvector = vec32.orthogonal(vec32.create(), this.plane);
      const perp = vec32.cross(vec32.create(), this.plane, rightvector);
      this.v = vec32.normalize(perp, perp);
      this.u = vec32.cross(vec32.create(), this.v, this.plane);
      this.basisMap = /* @__PURE__ */ new Map();
      const projected = slice2.edges.map((e) => e.map((v) => this.to2D(v)));
      const geometry = geom22.create(projected);
      this.roots = assignHoles(geometry);
    }
    /*
     * project a 3D point onto the 2D plane
     */
    to2D(vector3) {
      const vector2 = vec22.fromValues(vec32.dot(vector3, this.u), vec32.dot(vector3, this.v));
      this.basisMap.set(vector2, vector3);
      return vector2;
    }
    /*
     * un-project a 2D point back into 3D
     */
    to3D(vector2) {
      const original = this.basisMap.get(vector2);
      if (original) {
        return original;
      } else {
        console.log("Warning: point not in original slice");
        const v1 = vec32.scale(vec32.create(), this.u, vector2[0]);
        const v22 = vec32.scale(vec32.create(), this.v, vector2[1]);
        const planeOrigin = vec32.scale(vec32.create(), plane2, plane2[3]);
        const v32 = vec32.add(v1, v1, planeOrigin);
        return vec32.add(v22, v22, v32);
      }
    }
  }
  polygonHierarchy = PolygonHierarchy;
  return polygonHierarchy;
}
var toPolygons_1;
var hasRequiredToPolygons;
function requireToPolygons() {
  if (hasRequiredToPolygons) return toPolygons_1;
  hasRequiredToPolygons = 1;
  const poly32 = requirePoly3();
  const earcut2 = requireEarcut();
  const PolygonHierarchy = requirePolygonHierarchy();
  const toPolygons = (slice2) => {
    const hierarchy = new PolygonHierarchy(slice2);
    const polygons = [];
    hierarchy.roots.forEach(({ solid, holes }) => {
      let index = solid.length;
      const holesIndex = [];
      holes.forEach((hole, i) => {
        holesIndex.push(index);
        index += hole.length;
      });
      const vertices = [solid, ...holes].flat();
      const data = vertices.flat();
      const getVertex = (i) => hierarchy.to3D(vertices[i]);
      const indices = earcut2(data, holesIndex);
      for (let i = 0; i < indices.length; i += 3) {
        const tri = indices.slice(i, i + 3).map(getVertex);
        polygons.push(poly32.fromPointsAndPlane(tri, hierarchy.plane));
      }
    });
    return polygons;
  };
  toPolygons_1 = toPolygons;
  return toPolygons_1;
}
var toString_1;
var hasRequiredToString;
function requireToString() {
  if (hasRequiredToString) return toString_1;
  hasRequiredToString = 1;
  const vec32 = requireVec3();
  const edgesToString = (edges) => edges.reduce((result, edge) => result += `[${vec32.toString(edge[0])}, ${vec32.toString(edge[1])}], `, "");
  const toString = (slice2) => `[${edgesToString(slice2.edges)}]`;
  toString_1 = toString;
  return toString_1;
}
var transform_1$1;
var hasRequiredTransform$1;
function requireTransform$1() {
  if (hasRequiredTransform$1) return transform_1$1;
  hasRequiredTransform$1 = 1;
  const vec32 = requireVec3();
  const create = requireCreate();
  const transform = (matrix, slice2) => {
    const edges = slice2.edges.map((edge) => [vec32.transform(vec32.create(), edge[0], matrix), vec32.transform(vec32.create(), edge[1], matrix)]);
    return create(edges);
  };
  transform_1$1 = transform;
  return transform_1$1;
}
var slice;
var hasRequiredSlice;
function requireSlice() {
  if (hasRequiredSlice) return slice;
  hasRequiredSlice = 1;
  slice = {
    calculatePlane: requireCalculatePlane(),
    clone: requireClone(),
    create: requireCreate(),
    equals: requireEquals(),
    fromPoints: requireFromPoints(),
    fromSides: requireFromSides(),
    isA: requireIsA(),
    reverse: requireReverse(),
    toEdges: requireToEdges(),
    toPolygons: requireToPolygons(),
    toString: requireToString(),
    transform: requireTransform$1()
  };
  return slice;
}
var repair_1;
var hasRequiredRepair;
function requireRepair() {
  if (hasRequiredRepair) return repair_1;
  hasRequiredRepair = 1;
  const vec32 = requireVec3();
  const create = requireCreate();
  const repair = (slice2) => {
    if (!slice2.edges) return slice2;
    let edges = slice2.edges;
    const vertexMap = /* @__PURE__ */ new Map();
    const edgeCount = /* @__PURE__ */ new Map();
    edges = edges.filter((e) => !vec32.equals(e[0], e[1]));
    edges.forEach((edge) => {
      const inKey = edge[0].toString();
      const outKey = edge[1].toString();
      vertexMap.set(inKey, edge[0]);
      vertexMap.set(outKey, edge[1]);
      edgeCount.set(inKey, (edgeCount.get(inKey) || 0) + 1);
      edgeCount.set(outKey, (edgeCount.get(outKey) || 0) - 1);
    });
    const missingIn = [];
    const missingOut = [];
    edgeCount.forEach((count, vertex) => {
      if (count < 0) missingIn.push(vertex);
      if (count > 0) missingOut.push(vertex);
    });
    missingIn.forEach((key1) => {
      const v1 = vertexMap.get(key1);
      let bestDistance = Infinity;
      let bestReplacement;
      missingOut.forEach((key2) => {
        const v22 = vertexMap.get(key2);
        const distance = vec32.distance(v1, v22);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestReplacement = v22;
        }
      });
      console.warn(`slice.repair: repairing vertex gap ${v1} to ${bestReplacement} distance ${bestDistance}`);
      edges = edges.map((edge) => {
        if (edge[0].toString() === key1) return [bestReplacement, edge[1]];
        if (edge[1].toString() === key1) return [edge[0], bestReplacement];
        return edge;
      });
    });
    return create(edges);
  };
  repair_1 = repair;
  return repair_1;
}
var extrudeWalls_1;
var hasRequiredExtrudeWalls;
function requireExtrudeWalls() {
  if (hasRequiredExtrudeWalls) return extrudeWalls_1;
  hasRequiredExtrudeWalls = 1;
  const { EPS } = requireConstants();
  const vec32 = requireVec3();
  const poly32 = requirePoly3();
  const slice2 = requireSlice();
  const gcd = (a, b) => {
    if (a === b) {
      return a;
    }
    if (a < b) {
      return gcd(b, a);
    }
    if (b === 1) {
      return 1;
    }
    if (b === 0) {
      return a;
    }
    return gcd(b, a % b);
  };
  const lcm = (a, b) => a * b / gcd(a, b);
  const repartitionEdges = (newlength, edges) => {
    const multiple = newlength / edges.length;
    if (multiple === 1) {
      return edges;
    }
    const divisor = vec32.fromValues(multiple, multiple, multiple);
    const increment = vec32.create();
    const newEdges = [];
    edges.forEach((edge) => {
      vec32.subtract(increment, edge[1], edge[0]);
      vec32.divide(increment, increment, divisor);
      let prev = edge[0];
      for (let i = 1; i <= multiple; ++i) {
        const next = vec32.add(vec32.create(), prev, increment);
        newEdges.push([prev, next]);
        prev = next;
      }
    });
    return newEdges;
  };
  const EPSAREA = EPS * EPS / 2 * Math.sin(Math.PI / 3);
  const extrudeWalls = (slice0, slice1) => {
    let edges0 = slice2.toEdges(slice0);
    let edges1 = slice2.toEdges(slice1);
    if (edges0.length !== edges1.length) {
      const newlength = lcm(edges0.length, edges1.length);
      if (newlength !== edges0.length) edges0 = repartitionEdges(newlength, edges0);
      if (newlength !== edges1.length) edges1 = repartitionEdges(newlength, edges1);
    }
    const walls = [];
    edges0.forEach((edge0, i) => {
      const edge1 = edges1[i];
      const poly0 = poly32.create([edge0[0], edge0[1], edge1[1]]);
      const poly0area = poly32.measureArea(poly0);
      if (Number.isFinite(poly0area) && poly0area > EPSAREA) walls.push(poly0);
      const poly1 = poly32.create([edge0[0], edge1[1], edge1[0]]);
      const poly1area = poly32.measureArea(poly1);
      if (Number.isFinite(poly1area) && poly1area > EPSAREA) walls.push(poly1);
    });
    return walls;
  };
  extrudeWalls_1 = extrudeWalls;
  return extrudeWalls_1;
}
var extrudeFromSlices_1;
var hasRequiredExtrudeFromSlices;
function requireExtrudeFromSlices() {
  if (hasRequiredExtrudeFromSlices) return extrudeFromSlices_1;
  hasRequiredExtrudeFromSlices = 1;
  const mat42 = requireMat4();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const slice2 = requireSlice();
  const repairSlice = requireRepair();
  const extrudeWalls = requireExtrudeWalls();
  const defaultCallback = (progress, index, base) => {
    let baseSlice = null;
    if (geom22.isA(base)) baseSlice = slice2.fromSides(geom22.toSides(base));
    if (poly32.isA(base)) baseSlice = slice2.fromPoints(poly32.toPoints(base));
    return progress === 0 || progress === 1 ? slice2.transform(mat42.fromTranslation(mat42.create(), [0, 0, progress]), baseSlice) : null;
  };
  const extrudeFromSlices = (options, base) => {
    const defaults = {
      numberOfSlices: 2,
      capStart: true,
      capEnd: true,
      close: false,
      repair: true,
      callback: defaultCallback
    };
    const { numberOfSlices, capStart, capEnd, close, repair, callback: generate } = Object.assign({}, defaults, options);
    if (numberOfSlices < 2) throw new Error("numberOfSlices must be 2 or more");
    if (repair) {
      base = repairSlice(base);
    }
    const sMax = numberOfSlices - 1;
    let startSlice = null;
    let endSlice = null;
    let prevSlice = null;
    let polygons = [];
    for (let s = 0; s < numberOfSlices; s++) {
      const currentSlice = generate(s / sMax, s, base);
      if (currentSlice) {
        if (!slice2.isA(currentSlice)) throw new Error("the callback function must return slice objects");
        const edges = slice2.toEdges(currentSlice);
        if (edges.length === 0) throw new Error("the callback function must return slices with one or more edges");
        if (prevSlice) {
          const walls = extrudeWalls(prevSlice, currentSlice);
          for (let i = 0; i < walls.length; i++) {
            polygons.push(walls[i]);
          }
        }
        if (s === 0) startSlice = currentSlice;
        if (s === numberOfSlices - 1) endSlice = currentSlice;
        prevSlice = currentSlice;
      }
    }
    if (capEnd) {
      const endPolygons = slice2.toPolygons(endSlice);
      for (let i = 0; i < endPolygons.length; i++) {
        polygons.push(endPolygons[i]);
      }
    }
    if (capStart) {
      const startPolygons = slice2.toPolygons(startSlice).map(poly32.invert);
      for (let i = 0; i < startPolygons.length; i++) {
        polygons.push(startPolygons[i]);
      }
    }
    if (!capStart && !capEnd) {
      if (close && !slice2.equals(endSlice, startSlice)) {
        const walls = extrudeWalls(endSlice, startSlice);
        for (let i = 0; i < walls.length; i++) {
          polygons.push(walls[i]);
        }
      }
    }
    return geom32.create(polygons);
  };
  extrudeFromSlices_1 = extrudeFromSlices;
  return extrudeFromSlices_1;
}
var extrudeRotate_1;
var hasRequiredExtrudeRotate;
function requireExtrudeRotate() {
  if (hasRequiredExtrudeRotate) return extrudeRotate_1;
  hasRequiredExtrudeRotate = 1;
  const { TAU } = requireConstants();
  const mat42 = requireMat4();
  const { mirrorX } = requireMirror();
  const geom22 = requireGeom2();
  const slice2 = requireSlice();
  const extrudeFromSlices = requireExtrudeFromSlices();
  const extrudeRotate = (options, geometry) => {
    const defaults = {
      segments: 12,
      startAngle: 0,
      angle: TAU,
      overflow: "cap"
    };
    let { segments, startAngle, angle: angle2, overflow } = Object.assign({}, defaults, options);
    if (segments < 3) throw new Error("segments must be greater then 3");
    startAngle = Math.abs(startAngle) > TAU ? startAngle % TAU : startAngle;
    angle2 = Math.abs(angle2) > TAU ? angle2 % TAU : angle2;
    let endAngle = startAngle + angle2;
    endAngle = Math.abs(endAngle) > TAU ? endAngle % TAU : endAngle;
    if (endAngle < startAngle) {
      const x = startAngle;
      startAngle = endAngle;
      endAngle = x;
    }
    let totalRotation = endAngle - startAngle;
    if (totalRotation <= 0) totalRotation = TAU;
    if (Math.abs(totalRotation) < TAU) {
      const anglePerSegment = TAU / segments;
      segments = Math.floor(Math.abs(totalRotation) / anglePerSegment);
      if (Math.abs(totalRotation) > segments * anglePerSegment) segments++;
    }
    let shapeSides = geom22.toSides(geometry);
    if (shapeSides.length === 0) throw new Error("the given geometry cannot be empty");
    const pointsWithNegativeX = shapeSides.filter((s) => s[0][0] < 0);
    const pointsWithPositiveX = shapeSides.filter((s) => s[0][0] >= 0);
    const arePointsWithNegAndPosX = pointsWithNegativeX.length > 0 && pointsWithPositiveX.length > 0;
    if (arePointsWithNegAndPosX && overflow === "cap") {
      if (pointsWithNegativeX.length > pointsWithPositiveX.length) {
        shapeSides = shapeSides.map((side) => {
          let point0 = side[0];
          let point1 = side[1];
          point0 = [Math.min(point0[0], 0), point0[1]];
          point1 = [Math.min(point1[0], 0), point1[1]];
          return [point0, point1];
        });
        geometry = geom22.create(shapeSides);
        geometry = mirrorX(geometry);
      } else if (pointsWithPositiveX.length >= pointsWithNegativeX.length) {
        shapeSides = shapeSides.map((side) => {
          let point0 = side[0];
          let point1 = side[1];
          point0 = [Math.max(point0[0], 0), point0[1]];
          point1 = [Math.max(point1[0], 0), point1[1]];
          return [point0, point1];
        });
        geometry = geom22.create(shapeSides);
      }
    }
    const rotationPerSlice = totalRotation / segments;
    const isCapped = Math.abs(totalRotation) < TAU;
    const baseSlice = slice2.fromSides(geom22.toSides(geometry));
    slice2.reverse(baseSlice, baseSlice);
    const matrix = mat42.create();
    const xRotationMatrix = mat42.fromXRotation(mat42.create(), TAU / 4);
    const zRotationMatrix = mat42.create();
    const createSlice = (progress, index, base) => {
      let Zrotation = rotationPerSlice * index + startAngle;
      if (totalRotation === TAU && index === segments) {
        Zrotation = startAngle;
      }
      mat42.fromZRotation(zRotationMatrix, Zrotation);
      mat42.multiply(matrix, zRotationMatrix, xRotationMatrix);
      return slice2.transform(matrix, base);
    };
    options = {
      numberOfSlices: segments + 1,
      capStart: isCapped,
      capEnd: isCapped,
      close: !isCapped,
      callback: createSlice
    };
    return extrudeFromSlices(options, baseSlice);
  };
  extrudeRotate_1 = extrudeRotate;
  return extrudeRotate_1;
}
var rotate_1;
var hasRequiredRotate;
function requireRotate() {
  if (hasRequiredRotate) return rotate_1;
  hasRequiredRotate = 1;
  const flatten = requireFlatten();
  const mat42 = requireMat4();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const rotate = (angles, ...objects) => {
    if (!Array.isArray(angles)) throw new Error("angles must be an array");
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    angles = angles.slice();
    while (angles.length < 3) angles.push(0);
    const yaw = angles[2];
    const pitch = angles[1];
    const roll = angles[0];
    const matrix = mat42.fromTaitBryanRotation(mat42.create(), yaw, pitch, roll);
    const results = objects.map((object) => {
      if (path22.isA(object)) return path22.transform(matrix, object);
      if (geom22.isA(object)) return geom22.transform(matrix, object);
      if (geom32.isA(object)) return geom32.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const rotateX = (angle2, ...objects) => rotate([angle2, 0, 0], objects);
  const rotateY = (angle2, ...objects) => rotate([0, angle2, 0], objects);
  const rotateZ = (angle2, ...objects) => rotate([0, 0, angle2], objects);
  rotate_1 = {
    rotate,
    rotateX,
    rotateY,
    rotateZ
  };
  return rotate_1;
}
var translate_1;
var hasRequiredTranslate;
function requireTranslate() {
  if (hasRequiredTranslate) return translate_1;
  hasRequiredTranslate = 1;
  const flatten = requireFlatten();
  const mat42 = requireMat4();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const translate = (offset, ...objects) => {
    if (!Array.isArray(offset)) throw new Error("offset must be an array");
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    offset = offset.slice();
    while (offset.length < 3) offset.push(0);
    const matrix = mat42.fromTranslation(mat42.create(), offset);
    const results = objects.map((object) => {
      if (path22.isA(object)) return path22.transform(matrix, object);
      if (geom22.isA(object)) return geom22.transform(matrix, object);
      if (geom32.isA(object)) return geom32.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const translateX = (offset, ...objects) => translate([offset, 0, 0], objects);
  const translateY = (offset, ...objects) => translate([0, offset, 0], objects);
  const translateZ = (offset, ...objects) => translate([0, 0, offset], objects);
  translate_1 = {
    translate,
    translateX,
    translateY,
    translateZ
  };
  return translate_1;
}
var torus_1;
var hasRequiredTorus;
function requireTorus() {
  if (hasRequiredTorus) return torus_1;
  hasRequiredTorus = 1;
  const { TAU } = requireConstants();
  const extrudeRotate = requireExtrudeRotate();
  const { rotate } = requireRotate();
  const { translate } = requireTranslate();
  const circle = requireCircle();
  const { isGT, isGTE } = requireCommonChecks();
  const torus = (options) => {
    const defaults = {
      innerRadius: 1,
      innerSegments: 32,
      outerRadius: 4,
      outerSegments: 32,
      innerRotation: 0,
      startAngle: 0,
      outerRotation: TAU
    };
    const { innerRadius, innerSegments, outerRadius, outerSegments, innerRotation, startAngle, outerRotation } = Object.assign({}, defaults, options);
    if (!isGT(innerRadius, 0)) throw new Error("innerRadius must be greater than zero");
    if (!isGTE(innerSegments, 3)) throw new Error("innerSegments must be three or more");
    if (!isGT(outerRadius, 0)) throw new Error("outerRadius must be greater than zero");
    if (!isGTE(outerSegments, 3)) throw new Error("outerSegments must be three or more");
    if (!isGTE(startAngle, 0)) throw new Error("startAngle must be positive");
    if (!isGT(outerRotation, 0)) throw new Error("outerRotation must be greater than zero");
    if (innerRadius >= outerRadius) throw new Error("inner circle is too large to rotate about the outer circle");
    let innerCircle = circle({ radius: innerRadius, segments: innerSegments });
    if (innerRotation !== 0) {
      innerCircle = rotate([0, 0, innerRotation], innerCircle);
    }
    innerCircle = translate([outerRadius, 0], innerCircle);
    const extrudeOptions = {
      startAngle,
      angle: outerRotation,
      segments: outerSegments
    };
    return extrudeRotate(extrudeOptions, innerCircle);
  };
  torus_1 = torus;
  return torus_1;
}
var triangle_1;
var hasRequiredTriangle;
function requireTriangle() {
  if (hasRequiredTriangle) return triangle_1;
  hasRequiredTriangle = 1;
  const { NEPS } = requireConstants();
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const { isNumberArray } = requireCommonChecks();
  const solveAngleFromSSS = (a, b, c) => Math.acos((a * a + b * b - c * c) / (2 * a * b));
  const solveSideFromSAS = (a, C, b) => {
    if (C > NEPS) {
      return Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));
    }
    return Math.sqrt((a - b) * (a - b) + a * b * C * C * (1 - C * C / 12));
  };
  const solveAAA = (angles) => {
    const eps = Math.abs(angles[0] + angles[1] + angles[2] - Math.PI);
    if (eps > NEPS) throw new Error("AAA triangles require angles that sum to PI");
    const A = angles[0];
    const B2 = angles[1];
    const C = Math.PI - A - B2;
    const c = 1;
    const a = c / Math.sin(C) * Math.sin(A);
    const b = c / Math.sin(C) * Math.sin(B2);
    return createTriangle(A, B2, C, a, b, c);
  };
  const solveAAS = (values) => {
    const A = values[0];
    const B2 = values[1];
    const C = Math.PI + NEPS - A - B2;
    if (C < NEPS) throw new Error("AAS triangles require angles that sum to PI");
    const a = values[2];
    const b = a / Math.sin(A) * Math.sin(B2);
    const c = a / Math.sin(A) * Math.sin(C);
    return createTriangle(A, B2, C, a, b, c);
  };
  const solveASA = (values) => {
    const A = values[0];
    const B2 = values[2];
    const C = Math.PI + NEPS - A - B2;
    if (C < NEPS) throw new Error("ASA triangles require angles that sum to PI");
    const c = values[1];
    const a = c / Math.sin(C) * Math.sin(A);
    const b = c / Math.sin(C) * Math.sin(B2);
    return createTriangle(A, B2, C, a, b, c);
  };
  const solveSAS = (values) => {
    const c = values[0];
    const B2 = values[1];
    const a = values[2];
    const b = solveSideFromSAS(c, B2, a);
    const A = solveAngleFromSSS(b, c, a);
    const C = Math.PI - A - B2;
    return createTriangle(A, B2, C, a, b, c);
  };
  const solveSSA = (values) => {
    const c = values[0];
    const a = values[1];
    const C = values[2];
    const A = Math.asin(a * Math.sin(C) / c);
    const B2 = Math.PI - A - C;
    const b = c / Math.sin(C) * Math.sin(B2);
    return createTriangle(A, B2, C, a, b, c);
  };
  const solveSSS = (lengths) => {
    const a = lengths[1];
    const b = lengths[2];
    const c = lengths[0];
    if (a + b <= c || b + c <= a || c + a <= b) {
      throw new Error("SSS triangle is incorrect, as the longest side is longer than the sum of the other sides");
    }
    const A = solveAngleFromSSS(b, c, a);
    const B2 = solveAngleFromSSS(c, a, b);
    const C = Math.PI - A - B2;
    return createTriangle(A, B2, C, a, b, c);
  };
  const createTriangle = (A, B2, C, a, b, c) => {
    const p0 = vec22.fromValues(0, 0);
    const p1 = vec22.fromValues(c, 0);
    const p2 = vec22.fromValues(a, 0);
    vec22.add(p2, vec22.rotate(p2, p2, [0, 0], Math.PI - B2), p1);
    return geom22.fromPoints([p0, p1, p2]);
  };
  const triangle2 = (options) => {
    const defaults = {
      type: "SSS",
      values: [1, 1, 1]
    };
    let { type, values } = Object.assign({}, defaults, options);
    if (typeof type !== "string") throw new Error("triangle type must be a string");
    type = type.toUpperCase();
    if (!((type[0] === "A" || type[0] === "S") && (type[1] === "A" || type[1] === "S") && (type[2] === "A" || type[2] === "S"))) throw new Error("triangle type must contain three letters; A or S");
    if (!isNumberArray(values, 3)) throw new Error("triangle values must contain three values");
    if (!values.every((n) => n > 0)) throw new Error("triangle values must be greater than zero");
    switch (type) {
      case "AAA":
        return solveAAA(values);
      case "AAS":
        return solveAAS(values);
      case "ASA":
        return solveASA(values);
      case "SAS":
        return solveSAS(values);
      case "SSA":
        return solveSSA(values);
      case "SSS":
        return solveSSS(values);
      default:
        throw new Error("invalid triangle type, try again");
    }
  };
  triangle_1 = triangle2;
  return triangle_1;
}
var primitives;
var hasRequiredPrimitives;
function requirePrimitives() {
  if (hasRequiredPrimitives) return primitives;
  hasRequiredPrimitives = 1;
  primitives = {
    arc: requireArc(),
    circle: requireCircle(),
    cube: requireCube(),
    cuboid: requireCuboid(),
    cylinder: requireCylinder(),
    cylinderElliptic: requireCylinderElliptic(),
    ellipse: requireEllipse(),
    ellipsoid: requireEllipsoid(),
    geodesicSphere: requireGeodesicSphere(),
    line: requireLine(),
    polygon: requirePolygon(),
    polyhedron: requirePolyhedron(),
    rectangle: requireRectangle(),
    roundedCuboid: requireRoundedCuboid(),
    roundedCylinder: requireRoundedCylinder(),
    roundedRectangle: requireRoundedRectangle(),
    sphere: requireSphere(),
    square: requireSquare(),
    star: requireStar(),
    torus: requireTorus(),
    triangle: requireTriangle()
  };
  return primitives;
}
var simplex;
var hasRequiredSimplex;
function requireSimplex() {
  if (hasRequiredSimplex) return simplex;
  hasRequiredSimplex = 1;
  simplex = {
    height: 14,
    32: [16],
    33: [10, 5, 21, 5, 7, void 0, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
    34: [16, 4, 21, 4, 14, void 0, 12, 21, 12, 14],
    35: [21, 11, 25, 4, -7, void 0, 17, 25, 10, -7, void 0, 4, 12, 18, 12, void 0, 3, 6, 17, 6],
    36: [20, 8, 25, 8, -4, void 0, 12, 25, 12, -4, void 0, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],
    37: [24, 21, 21, 3, 0, void 0, 8, 21, 10, 19, 10, 17, 9, 15, 7, 14, 5, 14, 3, 16, 3, 18, 4, 20, 6, 21, 8, 21, 10, 20, 13, 19, 16, 19, 19, 20, 21, 21, void 0, 17, 7, 15, 6, 14, 4, 14, 2, 16, 0, 18, 0, 20, 1, 21, 3, 21, 5, 19, 7, 17, 7],
    38: [26, 23, 12, 23, 13, 22, 14, 21, 14, 20, 13, 19, 11, 17, 6, 15, 3, 13, 1, 11, 0, 7, 0, 5, 1, 4, 2, 3, 4, 3, 6, 4, 8, 5, 9, 12, 13, 13, 14, 14, 16, 14, 18, 13, 20, 11, 21, 9, 20, 8, 18, 8, 16, 9, 13, 11, 10, 16, 3, 18, 1, 20, 0, 22, 0, 23, 1, 23, 2],
    39: [10, 5, 19, 4, 20, 5, 21, 6, 20, 6, 18, 5, 16, 4, 15],
    40: [14, 11, 25, 9, 23, 7, 20, 5, 16, 4, 11, 4, 7, 5, 2, 7, -2, 9, -5, 11, -7],
    41: [14, 3, 25, 5, 23, 7, 20, 9, 16, 10, 11, 10, 7, 9, 2, 7, -2, 5, -5, 3, -7],
    42: [16, 8, 21, 8, 9, void 0, 3, 18, 13, 12, void 0, 13, 18, 3, 12],
    43: [26, 13, 18, 13, 0, void 0, 4, 9, 22, 9],
    44: [10, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],
    45: [26, 4, 9, 22, 9],
    46: [10, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
    47: [22, 20, 25, 2, -7],
    48: [20, 9, 21, 6, 20, 4, 17, 3, 12, 3, 9, 4, 4, 6, 1, 9, 0, 11, 0, 14, 1, 16, 4, 17, 9, 17, 12, 16, 17, 14, 20, 11, 21, 9, 21],
    49: [20, 6, 17, 8, 18, 11, 21, 11, 0],
    50: [20, 4, 16, 4, 17, 5, 19, 6, 20, 8, 21, 12, 21, 14, 20, 15, 19, 16, 17, 16, 15, 15, 13, 13, 10, 3, 0, 17, 0],
    51: [20, 5, 21, 16, 21, 10, 13, 13, 13, 15, 12, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],
    52: [20, 13, 21, 3, 7, 18, 7, void 0, 13, 21, 13, 0],
    53: [20, 15, 21, 5, 21, 4, 12, 5, 13, 8, 14, 11, 14, 14, 13, 16, 11, 17, 8, 17, 6, 16, 3, 14, 1, 11, 0, 8, 0, 5, 1, 4, 2, 3, 4],
    54: [20, 16, 18, 15, 20, 12, 21, 10, 21, 7, 20, 5, 17, 4, 12, 4, 7, 5, 3, 7, 1, 10, 0, 11, 0, 14, 1, 16, 3, 17, 6, 17, 7, 16, 10, 14, 12, 11, 13, 10, 13, 7, 12, 5, 10, 4, 7],
    55: [20, 17, 21, 7, 0, void 0, 3, 21, 17, 21],
    56: [20, 8, 21, 5, 20, 4, 18, 4, 16, 5, 14, 7, 13, 11, 12, 14, 11, 16, 9, 17, 7, 17, 4, 16, 2, 15, 1, 12, 0, 8, 0, 5, 1, 4, 2, 3, 4, 3, 7, 4, 9, 6, 11, 9, 12, 13, 13, 15, 14, 16, 16, 16, 18, 15, 20, 12, 21, 8, 21],
    57: [20, 16, 14, 15, 11, 13, 9, 10, 8, 9, 8, 6, 9, 4, 11, 3, 14, 3, 15, 4, 18, 6, 20, 9, 21, 10, 21, 13, 20, 15, 18, 16, 14, 16, 9, 15, 4, 13, 1, 10, 0, 8, 0, 5, 1, 4, 3],
    58: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, void 0, 5, 2, 4, 1, 5, 0, 6, 1, 5, 2],
    59: [10, 5, 14, 4, 13, 5, 12, 6, 13, 5, 14, void 0, 6, 1, 5, 0, 4, 1, 5, 2, 6, 1, 6, -1, 5, -3, 4, -4],
    60: [24, 20, 18, 4, 9, 20, 0],
    61: [26, 4, 12, 22, 12, void 0, 4, 6, 22, 6],
    62: [24, 4, 18, 20, 9, 4, 0],
    63: [18, 3, 16, 3, 17, 4, 19, 5, 20, 7, 21, 11, 21, 13, 20, 14, 19, 15, 17, 15, 15, 14, 13, 13, 12, 9, 10, 9, 7, void 0, 9, 2, 8, 1, 9, 0, 10, 1, 9, 2],
    64: [27, 18, 13, 17, 15, 15, 16, 12, 16, 10, 15, 9, 14, 8, 11, 8, 8, 9, 6, 11, 5, 14, 5, 16, 6, 17, 8, void 0, 12, 16, 10, 14, 9, 11, 9, 8, 10, 6, 11, 5, void 0, 18, 16, 17, 8, 17, 6, 19, 5, 21, 5, 23, 7, 24, 10, 24, 12, 23, 15, 22, 17, 20, 19, 18, 20, 15, 21, 12, 21, 9, 20, 7, 19, 5, 17, 4, 15, 3, 12, 3, 9, 4, 6, 5, 4, 7, 2, 9, 1, 12, 0, 15, 0, 18, 1, 20, 2, 21, 3, void 0, 19, 16, 18, 8, 18, 6, 19, 5],
    65: [18, 9, 21, 1, 0, void 0, 9, 21, 17, 0, void 0, 4, 7, 14, 7],
    66: [21, 4, 21, 4, 0, void 0, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, void 0, 4, 11, 13, 11, 16, 10, 17, 9, 18, 7, 18, 4, 17, 2, 16, 1, 13, 0, 4, 0],
    67: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5],
    68: [21, 4, 21, 4, 0, void 0, 4, 21, 11, 21, 14, 20, 16, 18, 17, 16, 18, 13, 18, 8, 17, 5, 16, 3, 14, 1, 11, 0, 4, 0],
    69: [19, 4, 21, 4, 0, void 0, 4, 21, 17, 21, void 0, 4, 11, 12, 11, void 0, 4, 0, 17, 0],
    70: [18, 4, 21, 4, 0, void 0, 4, 21, 17, 21, void 0, 4, 11, 12, 11],
    71: [21, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 18, 8, void 0, 13, 8, 18, 8],
    72: [22, 4, 21, 4, 0, void 0, 18, 21, 18, 0, void 0, 4, 11, 18, 11],
    73: [8, 4, 21, 4, 0],
    74: [16, 12, 21, 12, 5, 11, 2, 10, 1, 8, 0, 6, 0, 4, 1, 3, 2, 2, 5, 2, 7],
    75: [21, 4, 21, 4, 0, void 0, 18, 21, 4, 7, void 0, 9, 12, 18, 0],
    76: [17, 4, 21, 4, 0, void 0, 4, 0, 16, 0],
    77: [24, 4, 21, 4, 0, void 0, 4, 21, 12, 0, void 0, 20, 21, 12, 0, void 0, 20, 21, 20, 0],
    78: [22, 4, 21, 4, 0, void 0, 4, 21, 18, 0, void 0, 18, 21, 18, 0],
    79: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21],
    80: [21, 4, 21, 4, 0, void 0, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 14, 17, 12, 16, 11, 13, 10, 4, 10],
    81: [22, 9, 21, 7, 20, 5, 18, 4, 16, 3, 13, 3, 8, 4, 5, 5, 3, 7, 1, 9, 0, 13, 0, 15, 1, 17, 3, 18, 5, 19, 8, 19, 13, 18, 16, 17, 18, 15, 20, 13, 21, 9, 21, void 0, 12, 4, 18, -2],
    82: [21, 4, 21, 4, 0, void 0, 4, 21, 13, 21, 16, 20, 17, 19, 18, 17, 18, 15, 17, 13, 16, 12, 13, 11, 4, 11, void 0, 11, 11, 18, 0],
    83: [20, 17, 18, 15, 20, 12, 21, 8, 21, 5, 20, 3, 18, 3, 16, 4, 14, 5, 13, 7, 12, 13, 10, 15, 9, 16, 8, 17, 6, 17, 3, 15, 1, 12, 0, 8, 0, 5, 1, 3, 3],
    84: [16, 8, 21, 8, 0, void 0, 1, 21, 15, 21],
    85: [22, 4, 21, 4, 6, 5, 3, 7, 1, 10, 0, 12, 0, 15, 1, 17, 3, 18, 6, 18, 21],
    86: [18, 1, 21, 9, 0, void 0, 17, 21, 9, 0],
    87: [24, 2, 21, 7, 0, void 0, 12, 21, 7, 0, void 0, 12, 21, 17, 0, void 0, 22, 21, 17, 0],
    88: [20, 3, 21, 17, 0, void 0, 17, 21, 3, 0],
    89: [18, 1, 21, 9, 11, 9, 0, void 0, 17, 21, 9, 11],
    90: [20, 17, 21, 3, 0, void 0, 3, 21, 17, 21, void 0, 3, 0, 17, 0],
    91: [14, 4, 25, 4, -7, void 0, 5, 25, 5, -7, void 0, 4, 25, 11, 25, void 0, 4, -7, 11, -7],
    92: [14, 0, 21, 14, -3],
    93: [14, 9, 25, 9, -7, void 0, 10, 25, 10, -7, void 0, 3, 25, 10, 25, void 0, 3, -7, 10, -7],
    94: [16, 6, 15, 8, 18, 10, 15, void 0, 3, 12, 8, 17, 13, 12, void 0, 8, 17, 8, 0],
    95: [16, 0, -2, 16, -2],
    96: [10, 6, 21, 5, 20, 4, 18, 4, 16, 5, 15, 6, 16, 5, 17],
    97: [19, 15, 14, 15, 0, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    98: [19, 4, 21, 4, 0, void 0, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],
    99: [18, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    100: [19, 15, 21, 15, 0, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    101: [18, 3, 8, 15, 8, 15, 10, 14, 12, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    102: [12, 10, 21, 8, 21, 6, 20, 5, 17, 5, 0, void 0, 2, 14, 9, 14],
    103: [19, 15, 14, 15, -2, 14, -5, 13, -6, 11, -7, 8, -7, 6, -6, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    104: [19, 4, 21, 4, 0, void 0, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],
    105: [8, 3, 21, 4, 20, 5, 21, 4, 22, 3, 21, void 0, 4, 14, 4, 0],
    106: [10, 5, 21, 6, 20, 7, 21, 6, 22, 5, 21, void 0, 6, 14, 6, -3, 5, -6, 3, -7, 1, -7],
    107: [17, 4, 21, 4, 0, void 0, 14, 14, 4, 4, void 0, 8, 8, 15, 0],
    108: [8, 4, 21, 4, 0],
    109: [30, 4, 14, 4, 0, void 0, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0, void 0, 15, 10, 18, 13, 20, 14, 23, 14, 25, 13, 26, 10, 26, 0],
    110: [19, 4, 14, 4, 0, void 0, 4, 10, 7, 13, 9, 14, 12, 14, 14, 13, 15, 10, 15, 0],
    111: [19, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3, 16, 6, 16, 8, 15, 11, 13, 13, 11, 14, 8, 14],
    112: [19, 4, 14, 4, -7, void 0, 4, 11, 6, 13, 8, 14, 11, 14, 13, 13, 15, 11, 16, 8, 16, 6, 15, 3, 13, 1, 11, 0, 8, 0, 6, 1, 4, 3],
    113: [19, 15, 14, 15, -7, void 0, 15, 11, 13, 13, 11, 14, 8, 14, 6, 13, 4, 11, 3, 8, 3, 6, 4, 3, 6, 1, 8, 0, 11, 0, 13, 1, 15, 3],
    114: [13, 4, 14, 4, 0, void 0, 4, 8, 5, 11, 7, 13, 9, 14, 12, 14],
    115: [17, 14, 11, 13, 13, 10, 14, 7, 14, 4, 13, 3, 11, 4, 9, 6, 8, 11, 7, 13, 6, 14, 4, 14, 3, 13, 1, 10, 0, 7, 0, 4, 1, 3, 3],
    116: [12, 5, 21, 5, 4, 6, 1, 8, 0, 10, 0, void 0, 2, 14, 9, 14],
    117: [19, 4, 14, 4, 4, 5, 1, 7, 0, 10, 0, 12, 1, 15, 4, void 0, 15, 14, 15, 0],
    118: [16, 2, 14, 8, 0, void 0, 14, 14, 8, 0],
    119: [22, 3, 14, 7, 0, void 0, 11, 14, 7, 0, void 0, 11, 14, 15, 0, void 0, 19, 14, 15, 0],
    120: [17, 3, 14, 14, 0, void 0, 14, 14, 3, 0],
    121: [16, 2, 14, 8, 0, void 0, 14, 14, 8, 0, 6, -4, 4, -6, 2, -7, 1, -7],
    122: [17, 14, 14, 3, 0, void 0, 3, 14, 14, 14, void 0, 3, 0, 14, 0],
    123: [14, 9, 25, 7, 24, 6, 23, 5, 21, 5, 19, 6, 17, 7, 16, 8, 14, 8, 12, 6, 10, void 0, 7, 24, 6, 22, 6, 20, 7, 18, 8, 17, 9, 15, 9, 13, 8, 11, 4, 9, 8, 7, 9, 5, 9, 3, 8, 1, 7, 0, 6, -2, 6, -4, 7, -6, void 0, 6, 8, 8, 6, 8, 4, 7, 2, 6, 1, 5, -1, 5, -3, 6, -5, 7, -6, 9, -7],
    124: [8, 4, 25, 4, -7],
    125: [14, 5, 25, 7, 24, 8, 23, 9, 21, 9, 19, 8, 17, 7, 16, 6, 14, 6, 12, 8, 10, void 0, 7, 24, 8, 22, 8, 20, 7, 18, 6, 17, 5, 15, 5, 13, 6, 11, 10, 9, 6, 7, 5, 5, 5, 3, 6, 1, 7, 0, 8, -2, 8, -4, 7, -6, void 0, 8, 8, 6, 6, 6, 4, 7, 2, 8, 1, 9, -1, 9, -3, 8, -5, 7, -6, 5, -7],
    126: [24, 3, 6, 3, 8, 4, 11, 6, 12, 8, 12, 10, 11, 14, 8, 16, 7, 18, 7, 20, 8, 21, 10, void 0, 3, 8, 4, 10, 6, 11, 8, 11, 10, 10, 14, 7, 16, 6, 18, 6, 20, 7, 21, 10, 21, 12]
  };
  return simplex;
}
var vectorParams_1;
var hasRequiredVectorParams;
function requireVectorParams() {
  if (hasRequiredVectorParams) return vectorParams_1;
  hasRequiredVectorParams = 1;
  const defaultFont = requireSimplex();
  const defaultsVectorParams = {
    xOffset: 0,
    yOffset: 0,
    input: "?",
    align: "left",
    font: defaultFont,
    height: 14,
    // == old vector_xxx simplex font height
    lineSpacing: 2.142857142857143,
    // == 30/14 == old vector_xxx ratio
    letterSpacing: 1,
    extrudeOffset: 0
  };
  const vectorParams = (options, input) => {
    if (!input && typeof options === "string") {
      options = { input: options };
    }
    options = options || {};
    const params = Object.assign({}, defaultsVectorParams, options);
    params.input = input || params.input;
    return params;
  };
  vectorParams_1 = vectorParams;
  return vectorParams_1;
}
var vectorChar_1;
var hasRequiredVectorChar;
function requireVectorChar() {
  if (hasRequiredVectorChar) return vectorChar_1;
  hasRequiredVectorChar = 1;
  const vectorParams = requireVectorParams();
  const vectorChar = (options, char) => {
    const {
      xOffset,
      yOffset,
      input,
      font,
      height,
      extrudeOffset
    } = vectorParams(options, char);
    let code = input.charCodeAt(0);
    if (!code || !font[code]) {
      code = 63;
    }
    const glyph = [].concat(font[code]);
    const ratio = (height - extrudeOffset) / font.height;
    const extrudeYOffset = extrudeOffset / 2;
    const width = glyph.shift() * ratio;
    const segments = [];
    let polyline = [];
    for (let i = 0, il = glyph.length; i < il; i += 2) {
      const gx = ratio * glyph[i] + xOffset;
      const gy = ratio * glyph[i + 1] + yOffset + extrudeYOffset;
      if (glyph[i] !== void 0) {
        polyline.push([gx, gy]);
        continue;
      }
      segments.push(polyline);
      polyline = [];
      i--;
    }
    if (polyline.length) {
      segments.push(polyline);
    }
    return { width, height, segments };
  };
  vectorChar_1 = vectorChar;
  return vectorChar_1;
}
var vectorText_1;
var hasRequiredVectorText;
function requireVectorText() {
  if (hasRequiredVectorText) return vectorText_1;
  hasRequiredVectorText = 1;
  const vectorChar = requireVectorChar();
  const vectorParams = requireVectorParams();
  const translateLine = (options, line) => {
    const { x, y } = Object.assign({ x: 0, y: 0 }, options || {});
    const segments = line.segments;
    let segment = null;
    let point = null;
    for (let i = 0, il = segments.length; i < il; i++) {
      segment = segments[i];
      for (let j = 0, jl = segment.length; j < jl; j++) {
        point = segment[j];
        segment[j] = [point[0] + x, point[1] + y];
      }
    }
    return line;
  };
  const vectorText = (options, text2) => {
    const {
      xOffset,
      yOffset,
      input,
      font,
      height,
      align,
      extrudeOffset,
      lineSpacing,
      letterSpacing
    } = vectorParams(options, text2);
    let [x, y] = [xOffset, yOffset];
    let i, il, char, vect, width, diff;
    let line = { width: 0, segments: [] };
    const lines = [];
    let output = [];
    let maxWidth = 0;
    const lineStart = x;
    const pushLine = () => {
      lines.push(line);
      maxWidth = Math.max(maxWidth, line.width);
      line = { width: 0, segments: [] };
    };
    for (i = 0, il = input.length; i < il; i++) {
      char = input[i];
      vect = vectorChar({ xOffset: x, yOffset: y, font, height, extrudeOffset }, char);
      if (char === "\n") {
        x = lineStart;
        y -= vect.height * lineSpacing;
        pushLine();
        continue;
      }
      width = vect.width * letterSpacing;
      line.width += width;
      x += width;
      if (char !== " ") {
        line.segments = line.segments.concat(vect.segments);
      }
    }
    if (line.segments.length) {
      pushLine();
    }
    for (i = 0, il = lines.length; i < il; i++) {
      line = lines[i];
      if (maxWidth > line.width) {
        diff = maxWidth - line.width;
        if (align === "right") {
          line = translateLine({ x: diff }, line);
        } else if (align === "center") {
          line = translateLine({ x: diff / 2 }, line);
        }
      }
      output = output.concat(line.segments);
    }
    return output;
  };
  vectorText_1 = vectorText;
  return vectorText_1;
}
var text;
var hasRequiredText;
function requireText() {
  if (hasRequiredText) return text;
  hasRequiredText = 1;
  text = {
    vectorChar: requireVectorChar(),
    vectorText: requireVectorText()
  };
  return text;
}
var areAllShapesTheSameType_1;
var hasRequiredAreAllShapesTheSameType;
function requireAreAllShapesTheSameType() {
  if (hasRequiredAreAllShapesTheSameType) return areAllShapesTheSameType_1;
  hasRequiredAreAllShapesTheSameType = 1;
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const areAllShapesTheSameType = (shapes) => {
    let previousType;
    for (const shape of shapes) {
      let currentType = 0;
      if (geom22.isA(shape)) currentType = 1;
      if (geom32.isA(shape)) currentType = 2;
      if (path22.isA(shape)) currentType = 3;
      if (previousType && currentType !== previousType) return false;
      previousType = currentType;
    }
    return true;
  };
  areAllShapesTheSameType_1 = areAllShapesTheSameType;
  return areAllShapesTheSameType_1;
}
var degToRad_1;
var hasRequiredDegToRad;
function requireDegToRad() {
  if (hasRequiredDegToRad) return degToRad_1;
  hasRequiredDegToRad = 1;
  const degToRad = (degrees) => degrees * 0.017453292519943295;
  degToRad_1 = degToRad;
  return degToRad_1;
}
var fnNumberSort_1;
var hasRequiredFnNumberSort;
function requireFnNumberSort() {
  if (hasRequiredFnNumberSort) return fnNumberSort_1;
  hasRequiredFnNumberSort = 1;
  const fnNumberSort = (a, b) => a - b;
  fnNumberSort_1 = fnNumberSort;
  return fnNumberSort_1;
}
var insertSorted_1;
var hasRequiredInsertSorted;
function requireInsertSorted() {
  if (hasRequiredInsertSorted) return insertSorted_1;
  hasRequiredInsertSorted = 1;
  const insertSorted = (array, element, comparefunc) => {
    let leftbound = 0;
    let rightbound = array.length;
    while (rightbound > leftbound) {
      const testindex = Math.floor((leftbound + rightbound) / 2);
      const testelement = array[testindex];
      const compareresult = comparefunc(element, testelement);
      if (compareresult > 0) {
        leftbound = testindex + 1;
      } else {
        rightbound = testindex;
      }
    }
    array.splice(leftbound, 0, element);
  };
  insertSorted_1 = insertSorted;
  return insertSorted_1;
}
var radiusToSegments_1;
var hasRequiredRadiusToSegments;
function requireRadiusToSegments() {
  if (hasRequiredRadiusToSegments) return radiusToSegments_1;
  hasRequiredRadiusToSegments = 1;
  const { TAU } = requireConstants();
  const radiusToSegments = (radius2, minimumLength, minimumAngle) => {
    const ss = minimumLength > 0 ? radius2 * TAU / minimumLength : 0;
    const as = minimumAngle > 0 ? TAU / minimumAngle : 0;
    return Math.ceil(Math.max(ss, as, 4));
  };
  radiusToSegments_1 = radiusToSegments;
  return radiusToSegments_1;
}
var radToDeg_1;
var hasRequiredRadToDeg;
function requireRadToDeg() {
  if (hasRequiredRadToDeg) return radToDeg_1;
  hasRequiredRadToDeg = 1;
  const radToDeg = (radians) => radians * 57.29577951308232;
  radToDeg_1 = radToDeg;
  return radToDeg_1;
}
var utils;
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  utils = {
    areAllShapesTheSameType: requireAreAllShapesTheSameType(),
    degToRad: requireDegToRad(),
    flatten: requireFlatten(),
    fnNumberSort: requireFnNumberSort(),
    insertSorted: requireInsertSorted(),
    radiusToSegments: requireRadiusToSegments(),
    radToDeg: requireRadToDeg()
  };
  return utils;
}
var fromFakePolygons_1;
var hasRequiredFromFakePolygons;
function requireFromFakePolygons() {
  if (hasRequiredFromFakePolygons) return fromFakePolygons_1;
  hasRequiredFromFakePolygons = 1;
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const fromFakePolygon = (epsilon, polygon) => {
    if (polygon.vertices.length < 4) {
      return null;
    }
    const vert1Indices = [];
    const points3D = polygon.vertices.filter((vertex, i) => {
      if (vertex[2] > 0) {
        vert1Indices.push(i);
        return true;
      }
      return false;
    });
    if (points3D.length !== 2) {
      throw new Error("Assertion failed: fromFakePolygon: not enough points found");
    }
    const points2D = points3D.map((v32) => {
      const x = Math.round(v32[0] / epsilon) * epsilon + 0;
      const y = Math.round(v32[1] / epsilon) * epsilon + 0;
      return vec22.fromValues(x, y);
    });
    if (vec22.equals(points2D[0], points2D[1])) return null;
    const d = vert1Indices[1] - vert1Indices[0];
    if (d === 1 || d === 3) {
      if (d === 1) {
        points2D.reverse();
      }
    } else {
      throw new Error("Assertion failed: fromFakePolygon: unknown index ordering");
    }
    return points2D;
  };
  const fromFakePolygons = (epsilon, polygons) => {
    const sides = polygons.map((polygon) => fromFakePolygon(epsilon, polygon)).filter((polygon) => polygon !== null);
    return geom22.create(sides);
  };
  fromFakePolygons_1 = fromFakePolygons;
  return fromFakePolygons_1;
}
var to3DWalls_1;
var hasRequiredTo3DWalls;
function requireTo3DWalls() {
  if (hasRequiredTo3DWalls) return to3DWalls_1;
  hasRequiredTo3DWalls = 1;
  const vec32 = requireVec3();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const to3DWall = (z0, z1, side) => {
    const points = [
      vec32.fromVec2(vec32.create(), side[0], z0),
      vec32.fromVec2(vec32.create(), side[1], z0),
      vec32.fromVec2(vec32.create(), side[1], z1),
      vec32.fromVec2(vec32.create(), side[0], z1)
    ];
    return poly32.create(points);
  };
  const to3DWalls = (options, geometry) => {
    const sides = geom22.toSides(geometry);
    const polygons = sides.map((side) => to3DWall(options.z0, options.z1, side));
    const result = geom32.create(polygons);
    return result;
  };
  to3DWalls_1 = to3DWalls;
  return to3DWalls_1;
}
var OrthoNormalBasis_1;
var hasRequiredOrthoNormalBasis;
function requireOrthoNormalBasis() {
  if (hasRequiredOrthoNormalBasis) return OrthoNormalBasis_1;
  hasRequiredOrthoNormalBasis = 1;
  const mat42 = requireMat4();
  const vec22 = requireVec2();
  const vec32 = requireVec3();
  const OrthoNormalBasis = function(plane2, rightvector) {
    if (arguments.length < 2) {
      rightvector = vec32.orthogonal(vec32.create(), plane2);
    }
    this.v = vec32.normalize(vec32.create(), vec32.cross(vec32.create(), plane2, rightvector));
    this.u = vec32.cross(vec32.create(), this.v, plane2);
    this.plane = plane2;
    this.planeorigin = vec32.scale(vec32.create(), plane2, plane2[3]);
  };
  OrthoNormalBasis.prototype = {
    getProjectionMatrix: function() {
      return mat42.fromValues(
        this.u[0],
        this.v[0],
        this.plane[0],
        0,
        this.u[1],
        this.v[1],
        this.plane[1],
        0,
        this.u[2],
        this.v[2],
        this.plane[2],
        0,
        0,
        0,
        -this.plane[3],
        1
      );
    },
    getInverseProjectionMatrix: function() {
      const p = vec32.scale(vec32.create(), this.plane, this.plane[3]);
      return mat42.fromValues(
        this.u[0],
        this.u[1],
        this.u[2],
        0,
        this.v[0],
        this.v[1],
        this.v[2],
        0,
        this.plane[0],
        this.plane[1],
        this.plane[2],
        0,
        p[0],
        p[1],
        p[2],
        1
      );
    },
    to2D: function(point) {
      return vec22.fromValues(vec32.dot(point, this.u), vec32.dot(point, this.v));
    },
    to3D: function(point) {
      const v1 = vec32.scale(vec32.create(), this.u, point[0]);
      const v22 = vec32.scale(vec32.create(), this.v, point[1]);
      const v32 = vec32.add(v1, v1, this.planeorigin);
      const v4 = vec32.add(v22, v22, v32);
      return v4;
    }
  };
  OrthoNormalBasis_1 = OrthoNormalBasis;
  return OrthoNormalBasis_1;
}
var reTesselateCoplanarPolygons_1;
var hasRequiredReTesselateCoplanarPolygons;
function requireReTesselateCoplanarPolygons() {
  if (hasRequiredReTesselateCoplanarPolygons) return reTesselateCoplanarPolygons_1;
  hasRequiredReTesselateCoplanarPolygons = 1;
  const { EPS } = requireConstants();
  const line22 = requireLine2();
  const vec22 = requireVec2();
  const OrthoNormalBasis = requireOrthoNormalBasis();
  const interpolateBetween2DPointsForY = requireInterpolateBetween2DPointsForY();
  const { insertSorted, fnNumberSort } = requireUtils();
  const poly32 = requirePoly3();
  const reTesselateCoplanarPolygons = (sourcepolygons) => {
    if (sourcepolygons.length < 2) return sourcepolygons;
    const destpolygons = [];
    const numpolygons = sourcepolygons.length;
    const plane2 = poly32.plane(sourcepolygons[0]);
    const orthobasis = new OrthoNormalBasis(plane2);
    const polygonvertices2d = [];
    const polygontopvertexindexes = [];
    const topy2polygonindexes = /* @__PURE__ */ new Map();
    const ycoordinatetopolygonindexes = /* @__PURE__ */ new Map();
    const ycoordinatebins = /* @__PURE__ */ new Map();
    const ycoordinateBinningFactor = 10 / EPS;
    for (let polygonindex = 0; polygonindex < numpolygons; polygonindex++) {
      const poly3d = sourcepolygons[polygonindex];
      let vertices2d = [];
      let numvertices = poly3d.vertices.length;
      let minindex = -1;
      if (numvertices > 0) {
        let miny;
        let maxy;
        for (let i = 0; i < numvertices; i++) {
          let pos2d = orthobasis.to2D(poly3d.vertices[i]);
          const ycoordinatebin = Math.floor(pos2d[1] * ycoordinateBinningFactor);
          let newy;
          if (ycoordinatebins.has(ycoordinatebin)) {
            newy = ycoordinatebins.get(ycoordinatebin);
          } else if (ycoordinatebins.has(ycoordinatebin + 1)) {
            newy = ycoordinatebins.get(ycoordinatebin + 1);
          } else if (ycoordinatebins.has(ycoordinatebin - 1)) {
            newy = ycoordinatebins.get(ycoordinatebin - 1);
          } else {
            newy = pos2d[1];
            ycoordinatebins.set(ycoordinatebin, pos2d[1]);
          }
          pos2d = vec22.fromValues(pos2d[0], newy);
          vertices2d.push(pos2d);
          const y = pos2d[1];
          if (i === 0 || y < miny) {
            miny = y;
            minindex = i;
          }
          if (i === 0 || y > maxy) {
            maxy = y;
          }
          let polygonindexes = ycoordinatetopolygonindexes.get(y);
          if (!polygonindexes) {
            polygonindexes = {};
            ycoordinatetopolygonindexes.set(y, polygonindexes);
          }
          polygonindexes[polygonindex] = true;
        }
        if (miny >= maxy) {
          vertices2d = [];
          numvertices = 0;
          minindex = -1;
        } else {
          let polygonindexes = topy2polygonindexes.get(miny);
          if (!polygonindexes) {
            polygonindexes = [];
            topy2polygonindexes.set(miny, polygonindexes);
          }
          polygonindexes.push(polygonindex);
        }
      }
      vertices2d.reverse();
      minindex = numvertices - minindex - 1;
      polygonvertices2d.push(vertices2d);
      polygontopvertexindexes.push(minindex);
    }
    const ycoordinates = [];
    ycoordinatetopolygonindexes.forEach((polylist, y) => ycoordinates.push(y));
    ycoordinates.sort(fnNumberSort);
    let activepolygons = [];
    let prevoutpolygonrow = [];
    for (let yindex = 0; yindex < ycoordinates.length; yindex++) {
      const newoutpolygonrow = [];
      const ycoordinate = ycoordinates[yindex];
      const polygonindexeswithcorner = ycoordinatetopolygonindexes.get(ycoordinate);
      let removeCount = 0;
      for (let activepolygonindex = 0; activepolygonindex < activepolygons.length; ++activepolygonindex) {
        const activepolygon = activepolygons[activepolygonindex];
        const polygonindex = activepolygon.polygonindex;
        if (polygonindexeswithcorner[polygonindex]) {
          const vertices2d = polygonvertices2d[polygonindex];
          const numvertices = vertices2d.length;
          let newleftvertexindex = activepolygon.leftvertexindex;
          let newrightvertexindex = activepolygon.rightvertexindex;
          while (true) {
            let nextleftvertexindex = newleftvertexindex + 1;
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
            if (vertices2d[nextleftvertexindex][1] !== ycoordinate) break;
            newleftvertexindex = nextleftvertexindex;
          }
          let nextrightvertexindex = newrightvertexindex - 1;
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
          if (vertices2d[nextrightvertexindex][1] === ycoordinate) {
            newrightvertexindex = nextrightvertexindex;
          }
          if (newleftvertexindex !== activepolygon.leftvertexindex && newleftvertexindex === newrightvertexindex) {
            activepolygon._remove = true;
            removeCount++;
          } else {
            activepolygon.leftvertexindex = newleftvertexindex;
            activepolygon.rightvertexindex = newrightvertexindex;
            activepolygon.topleft = vertices2d[newleftvertexindex];
            activepolygon.topright = vertices2d[newrightvertexindex];
            let nextleftvertexindex = newleftvertexindex + 1;
            if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
            activepolygon.bottomleft = vertices2d[nextleftvertexindex];
            let nextrightvertexindex2 = newrightvertexindex - 1;
            if (nextrightvertexindex2 < 0) nextrightvertexindex2 = numvertices - 1;
            activepolygon.bottomright = vertices2d[nextrightvertexindex2];
          }
        }
      }
      if (removeCount > 0) {
        activepolygons = activepolygons.filter((p) => !p._remove);
      }
      let nextycoordinate;
      if (yindex >= ycoordinates.length - 1) {
        activepolygons = [];
        nextycoordinate = null;
      } else {
        nextycoordinate = Number(ycoordinates[yindex + 1]);
        const middleycoordinate = 0.5 * (ycoordinate + nextycoordinate);
        const startingpolygonindexes = topy2polygonindexes.get(ycoordinate);
        for (const polygonindexKey in startingpolygonindexes) {
          const polygonindex = startingpolygonindexes[polygonindexKey];
          const vertices2d = polygonvertices2d[polygonindex];
          const numvertices = vertices2d.length;
          const topvertexindex = polygontopvertexindexes[polygonindex];
          let topleftvertexindex = topvertexindex;
          while (true) {
            let i = topleftvertexindex + 1;
            if (i >= numvertices) i = 0;
            if (vertices2d[i][1] !== ycoordinate) break;
            if (i === topvertexindex) break;
            topleftvertexindex = i;
          }
          let toprightvertexindex = topvertexindex;
          while (true) {
            let i = toprightvertexindex - 1;
            if (i < 0) i = numvertices - 1;
            if (vertices2d[i][1] !== ycoordinate) break;
            if (i === topleftvertexindex) break;
            toprightvertexindex = i;
          }
          let nextleftvertexindex = topleftvertexindex + 1;
          if (nextleftvertexindex >= numvertices) nextleftvertexindex = 0;
          let nextrightvertexindex = toprightvertexindex - 1;
          if (nextrightvertexindex < 0) nextrightvertexindex = numvertices - 1;
          const newactivepolygon = {
            polygonindex,
            leftvertexindex: topleftvertexindex,
            rightvertexindex: toprightvertexindex,
            topleft: vertices2d[topleftvertexindex],
            topright: vertices2d[toprightvertexindex],
            bottomleft: vertices2d[nextleftvertexindex],
            bottomright: vertices2d[nextrightvertexindex]
          };
          insertSorted(activepolygons, newactivepolygon, (el1, el2) => {
            const x1 = interpolateBetween2DPointsForY(el1.topleft, el1.bottomleft, middleycoordinate);
            const x2 = interpolateBetween2DPointsForY(el2.topleft, el2.bottomleft, middleycoordinate);
            if (x1 > x2) return 1;
            if (x1 < x2) return -1;
            return 0;
          });
        }
      }
      for (const activepolygonKey in activepolygons) {
        const activepolygon = activepolygons[activepolygonKey];
        let x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, ycoordinate);
        const topleft = vec22.fromValues(x, ycoordinate);
        x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, ycoordinate);
        const topright = vec22.fromValues(x, ycoordinate);
        x = interpolateBetween2DPointsForY(activepolygon.topleft, activepolygon.bottomleft, nextycoordinate);
        const bottomleft = vec22.fromValues(x, nextycoordinate);
        x = interpolateBetween2DPointsForY(activepolygon.topright, activepolygon.bottomright, nextycoordinate);
        const bottomright = vec22.fromValues(x, nextycoordinate);
        const outpolygon = {
          topleft,
          topright,
          bottomleft,
          bottomright,
          leftline: line22.fromPoints(line22.create(), topleft, bottomleft),
          rightline: line22.fromPoints(line22.create(), bottomright, topright)
        };
        if (newoutpolygonrow.length > 0) {
          const prevoutpolygon = newoutpolygonrow[newoutpolygonrow.length - 1];
          const d1 = vec22.distance(outpolygon.topleft, prevoutpolygon.topright);
          const d2 = vec22.distance(outpolygon.bottomleft, prevoutpolygon.bottomright);
          if (d1 < EPS && d2 < EPS) {
            outpolygon.topleft = prevoutpolygon.topleft;
            outpolygon.leftline = prevoutpolygon.leftline;
            outpolygon.bottomleft = prevoutpolygon.bottomleft;
            newoutpolygonrow.splice(newoutpolygonrow.length - 1, 1);
          }
        }
        newoutpolygonrow.push(outpolygon);
      }
      if (yindex > 0) {
        const prevcontinuedindexes = /* @__PURE__ */ new Set();
        const matchedindexes = /* @__PURE__ */ new Set();
        for (let i = 0; i < newoutpolygonrow.length; i++) {
          const thispolygon = newoutpolygonrow[i];
          for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
            if (!matchedindexes.has(ii)) {
              const prevpolygon = prevoutpolygonrow[ii];
              if (vec22.distance(prevpolygon.bottomleft, thispolygon.topleft) < EPS) {
                if (vec22.distance(prevpolygon.bottomright, thispolygon.topright) < EPS) {
                  matchedindexes.add(ii);
                  const v1 = line22.direction(thispolygon.leftline);
                  const v22 = line22.direction(prevpolygon.leftline);
                  const d1 = v1[0] - v22[0];
                  const v32 = line22.direction(thispolygon.rightline);
                  const v4 = line22.direction(prevpolygon.rightline);
                  const d2 = v32[0] - v4[0];
                  const leftlinecontinues = Math.abs(d1) < EPS;
                  const rightlinecontinues = Math.abs(d2) < EPS;
                  const leftlineisconvex = leftlinecontinues || d1 >= 0;
                  const rightlineisconvex = rightlinecontinues || d2 >= 0;
                  if (leftlineisconvex && rightlineisconvex) {
                    thispolygon.outpolygon = prevpolygon.outpolygon;
                    thispolygon.leftlinecontinues = leftlinecontinues;
                    thispolygon.rightlinecontinues = rightlinecontinues;
                    prevcontinuedindexes.add(ii);
                  }
                  break;
                }
              }
            }
          }
        }
        for (let ii = 0; ii < prevoutpolygonrow.length; ii++) {
          if (!prevcontinuedindexes.has(ii)) {
            const prevpolygon = prevoutpolygonrow[ii];
            prevpolygon.outpolygon.rightpoints.push(prevpolygon.bottomright);
            if (vec22.distance(prevpolygon.bottomright, prevpolygon.bottomleft) > EPS) {
              prevpolygon.outpolygon.leftpoints.push(prevpolygon.bottomleft);
            }
            prevpolygon.outpolygon.leftpoints.reverse();
            const points2d = prevpolygon.outpolygon.rightpoints.concat(prevpolygon.outpolygon.leftpoints);
            const vertices3d = points2d.map((point2d) => orthobasis.to3D(point2d));
            const polygon = poly32.fromPointsAndPlane(vertices3d, plane2);
            if (polygon.vertices.length) destpolygons.push(polygon);
          }
        }
      }
      for (let i = 0; i < newoutpolygonrow.length; i++) {
        const thispolygon = newoutpolygonrow[i];
        if (!thispolygon.outpolygon) {
          thispolygon.outpolygon = {
            leftpoints: [],
            rightpoints: []
          };
          thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
          if (vec22.distance(thispolygon.topleft, thispolygon.topright) > EPS) {
            thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
          }
        } else {
          if (!thispolygon.leftlinecontinues) {
            thispolygon.outpolygon.leftpoints.push(thispolygon.topleft);
          }
          if (!thispolygon.rightlinecontinues) {
            thispolygon.outpolygon.rightpoints.push(thispolygon.topright);
          }
        }
      }
      prevoutpolygonrow = newoutpolygonrow;
    }
    return destpolygons;
  };
  reTesselateCoplanarPolygons_1 = reTesselateCoplanarPolygons;
  return reTesselateCoplanarPolygons_1;
}
var retessellate_1;
var hasRequiredRetessellate;
function requireRetessellate() {
  if (hasRequiredRetessellate) return retessellate_1;
  hasRequiredRetessellate = 1;
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const { NEPS } = requireConstants();
  const reTesselateCoplanarPolygons = requireReTesselateCoplanarPolygons();
  const retessellate = (geometry) => {
    if (geometry.isRetesselated) {
      return geometry;
    }
    const polygons = geom32.toPolygons(geometry).map((polygon, index) => ({ vertices: polygon.vertices, plane: poly32.plane(polygon), index }));
    const classified = classifyPolygons(polygons);
    const destPolygons = [];
    classified.forEach((group) => {
      if (Array.isArray(group)) {
        const coplanarPolygons = reTesselateCoplanarPolygons(group);
        for (let i = 0; i < coplanarPolygons.length; i++) {
          destPolygons.push(coplanarPolygons[i]);
        }
      } else {
        destPolygons.push(group);
      }
    });
    const result = geom32.create(destPolygons);
    result.isRetesselated = true;
    return result;
  };
  const classifyPolygons = (polygons) => {
    let clusters = [polygons];
    const nonCoplanar = [];
    for (let component = 3; component >= 0; component--) {
      const maybeCoplanar = [];
      const tolerance = component === 3 ? 15e-9 : NEPS;
      clusters.forEach((cluster) => {
        cluster.sort(byPlaneComponent(component, tolerance));
        let startIndex = 0;
        for (let i = 1; i < cluster.length; i++) {
          if (cluster[i].plane[component] - cluster[startIndex].plane[component] > tolerance) {
            if (i - startIndex === 1) {
              nonCoplanar.push(cluster[startIndex]);
            } else {
              maybeCoplanar.push(cluster.slice(startIndex, i));
            }
            startIndex = i;
          }
        }
        if (cluster.length - startIndex === 1) {
          nonCoplanar.push(cluster[startIndex]);
        } else {
          maybeCoplanar.push(cluster.slice(startIndex));
        }
      });
      clusters = maybeCoplanar;
    }
    const result = [];
    clusters.forEach((cluster) => {
      if (cluster[0]) result[cluster[0].index] = cluster;
    });
    nonCoplanar.forEach((polygon) => {
      result[polygon.index] = polygon;
    });
    return result;
  };
  const byPlaneComponent = (component, tolerance) => (a, b) => {
    if (a.plane[component] - b.plane[component] > tolerance) {
      return 1;
    } else if (b.plane[component] - a.plane[component] > tolerance) {
      return -1;
    }
    return 0;
  };
  retessellate_1 = retessellate;
  return retessellate_1;
}
var mayOverlap_1;
var hasRequiredMayOverlap;
function requireMayOverlap() {
  if (hasRequiredMayOverlap) return mayOverlap_1;
  hasRequiredMayOverlap = 1;
  const { EPS } = requireConstants();
  const measureBoundingBox = requireMeasureBoundingBox();
  const mayOverlap = (geometry1, geometry2) => {
    if (geometry1.polygons.length === 0 || geometry2.polygons.length === 0) {
      return false;
    }
    const bounds1 = measureBoundingBox(geometry1);
    const min1 = bounds1[0];
    const max1 = bounds1[1];
    const bounds2 = measureBoundingBox(geometry2);
    const min2 = bounds2[0];
    const max2 = bounds2[1];
    if (min2[0] - max1[0] > EPS) return false;
    if (min1[0] - max2[0] > EPS) return false;
    if (min2[1] - max1[1] > EPS) return false;
    if (min1[1] - max2[1] > EPS) return false;
    if (min2[2] - max1[2] > EPS) return false;
    if (min1[2] - max2[2] > EPS) return false;
    return true;
  };
  mayOverlap_1 = mayOverlap;
  return mayOverlap_1;
}
var Node_1;
var hasRequiredNode;
function requireNode() {
  if (hasRequiredNode) return Node_1;
  hasRequiredNode = 1;
  const plane2 = requirePlane$1();
  const poly32 = requirePoly3();
  class Node {
    constructor(parent) {
      this.plane = null;
      this.front = null;
      this.back = null;
      this.polygontreenodes = [];
      this.parent = parent;
    }
    // Convert solid space to empty space and empty space to solid space.
    invert() {
      const queue = [this];
      let node;
      for (let i = 0; i < queue.length; i++) {
        node = queue[i];
        if (node.plane) node.plane = plane2.flip(plane2.create(), node.plane);
        if (node.front) queue.push(node.front);
        if (node.back) queue.push(node.back);
        const temp = node.front;
        node.front = node.back;
        node.back = temp;
      }
    }
    // clip polygontreenodes to our plane
    // calls remove() for all clipped PolygonTreeNodes
    clipPolygons(polygontreenodes, alsoRemovecoplanarFront) {
      let current = { node: this, polygontreenodes };
      let node;
      const stack = [];
      do {
        node = current.node;
        polygontreenodes = current.polygontreenodes;
        if (node.plane) {
          const plane3 = node.plane;
          const backnodes = [];
          const frontnodes = [];
          const coplanarfrontnodes = alsoRemovecoplanarFront ? backnodes : frontnodes;
          const numpolygontreenodes = polygontreenodes.length;
          for (let i = 0; i < numpolygontreenodes; i++) {
            const treenode = polygontreenodes[i];
            if (!treenode.isRemoved()) {
              treenode.splitByPlane(plane3, coplanarfrontnodes, backnodes, frontnodes, backnodes);
            }
          }
          if (node.front && frontnodes.length > 0) {
            stack.push({ node: node.front, polygontreenodes: frontnodes });
          }
          const numbacknodes = backnodes.length;
          if (node.back && numbacknodes > 0) {
            stack.push({ node: node.back, polygontreenodes: backnodes });
          } else {
            for (let i = 0; i < numbacknodes; i++) {
              backnodes[i].remove();
            }
          }
        }
        current = stack.pop();
      } while (current !== void 0);
    }
    // Remove all polygons in this BSP tree that are inside the other BSP tree
    // `tree`.
    clipTo(tree, alsoRemovecoplanarFront) {
      let node = this;
      const stack = [];
      do {
        if (node.polygontreenodes.length > 0) {
          tree.rootnode.clipPolygons(node.polygontreenodes, alsoRemovecoplanarFront);
        }
        if (node.front) stack.push(node.front);
        if (node.back) stack.push(node.back);
        node = stack.pop();
      } while (node !== void 0);
    }
    addPolygonTreeNodes(newpolygontreenodes) {
      let current = { node: this, polygontreenodes: newpolygontreenodes };
      const stack = [];
      do {
        const node = current.node;
        const polygontreenodes = current.polygontreenodes;
        if (polygontreenodes.length === 0) {
          current = stack.pop();
          continue;
        }
        if (!node.plane) {
          let index = 0;
          index = Math.floor(polygontreenodes.length / 2);
          const bestpoly = polygontreenodes[index].getPolygon();
          node.plane = poly32.plane(bestpoly);
        }
        const frontnodes = [];
        const backnodes = [];
        const n = polygontreenodes.length;
        for (let i = 0; i < n; ++i) {
          polygontreenodes[i].splitByPlane(node.plane, node.polygontreenodes, backnodes, frontnodes, backnodes);
        }
        if (frontnodes.length > 0) {
          if (!node.front) node.front = new Node(node);
          const stopCondition = n === frontnodes.length && backnodes.length === 0;
          if (stopCondition) node.front.polygontreenodes = frontnodes;
          else stack.push({ node: node.front, polygontreenodes: frontnodes });
        }
        if (backnodes.length > 0) {
          if (!node.back) node.back = new Node(node);
          const stopCondition = n === backnodes.length && frontnodes.length === 0;
          if (stopCondition) node.back.polygontreenodes = backnodes;
          else stack.push({ node: node.back, polygontreenodes: backnodes });
        }
        current = stack.pop();
      } while (current !== void 0);
    }
  }
  Node_1 = Node;
  return Node_1;
}
var splitLineSegmentByPlane_1;
var hasRequiredSplitLineSegmentByPlane;
function requireSplitLineSegmentByPlane() {
  if (hasRequiredSplitLineSegmentByPlane) return splitLineSegmentByPlane_1;
  hasRequiredSplitLineSegmentByPlane = 1;
  const vec32 = requireVec3();
  const splitLineSegmentByPlane = (plane2, p1, p2) => {
    const direction = vec32.subtract(vec32.create(), p2, p1);
    let lambda = (plane2[3] - vec32.dot(plane2, p1)) / vec32.dot(plane2, direction);
    if (Number.isNaN(lambda)) lambda = 0;
    if (lambda > 1) lambda = 1;
    if (lambda < 0) lambda = 0;
    vec32.scale(direction, direction, lambda);
    vec32.add(direction, p1, direction);
    return direction;
  };
  splitLineSegmentByPlane_1 = splitLineSegmentByPlane;
  return splitLineSegmentByPlane_1;
}
var splitPolygonByPlane_1;
var hasRequiredSplitPolygonByPlane;
function requireSplitPolygonByPlane() {
  if (hasRequiredSplitPolygonByPlane) return splitPolygonByPlane_1;
  hasRequiredSplitPolygonByPlane = 1;
  const { EPS } = requireConstants();
  const plane2 = requirePlane$1();
  const vec32 = requireVec3();
  const poly32 = requirePoly3();
  const splitLineSegmentByPlane = requireSplitLineSegmentByPlane();
  const EPS_SQUARED = EPS * EPS;
  const removeConsecutiveDuplicates = (vertices) => {
    const result = [];
    let prevvertex = vertices[vertices.length - 1];
    for (let i = 0; i < vertices.length; i++) {
      const vertex = vertices[i];
      if (vec32.squaredDistance(vertex, prevvertex) >= EPS_SQUARED) {
        result.push(vertex);
      }
      prevvertex = vertex;
    }
    return result;
  };
  const splitPolygonByPlane = (splane, polygon) => {
    const result = {
      type: null,
      front: null,
      back: null
    };
    const vertices = polygon.vertices;
    const numvertices = vertices.length;
    const pplane = poly32.plane(polygon);
    if (plane2.equals(pplane, splane)) {
      result.type = 0;
    } else {
      let hasfront = false;
      let hasback = false;
      const vertexIsBack = [];
      const MINEPS = -EPS;
      for (let i = 0; i < numvertices; i++) {
        const t = vec32.dot(splane, vertices[i]) - splane[3];
        const isback = t < MINEPS;
        vertexIsBack.push(isback);
        if (t > EPS) hasfront = true;
        if (t < MINEPS) hasback = true;
      }
      if (!hasfront && !hasback) {
        const t = vec32.dot(splane, pplane);
        result.type = t >= 0 ? 0 : 1;
      } else if (!hasback) {
        result.type = 2;
      } else if (!hasfront) {
        result.type = 3;
      } else {
        result.type = 4;
        const frontvertices = [];
        const backvertices = [];
        let isback = vertexIsBack[0];
        for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
          const vertex = vertices[vertexindex];
          let nextvertexindex = vertexindex + 1;
          if (nextvertexindex >= numvertices) nextvertexindex = 0;
          const nextisback = vertexIsBack[nextvertexindex];
          if (isback === nextisback) {
            if (isback) {
              backvertices.push(vertex);
            } else {
              frontvertices.push(vertex);
            }
          } else {
            const nextpoint = vertices[nextvertexindex];
            const intersectionpoint = splitLineSegmentByPlane(splane, vertex, nextpoint);
            if (isback) {
              backvertices.push(vertex);
              backvertices.push(intersectionpoint);
              frontvertices.push(intersectionpoint);
            } else {
              frontvertices.push(vertex);
              frontvertices.push(intersectionpoint);
              backvertices.push(intersectionpoint);
            }
          }
          isback = nextisback;
        }
        if (frontvertices.length >= 3) {
          const frontFiltered = removeConsecutiveDuplicates(frontvertices);
          if (frontFiltered.length >= 3) {
            result.front = poly32.fromPointsAndPlane(frontFiltered, pplane);
          }
        }
        if (backvertices.length >= 3) {
          const backFiltered = removeConsecutiveDuplicates(backvertices);
          if (backFiltered.length >= 3) {
            result.back = poly32.fromPointsAndPlane(backFiltered, pplane);
          }
        }
      }
    }
    return result;
  };
  splitPolygonByPlane_1 = splitPolygonByPlane;
  return splitPolygonByPlane_1;
}
var PolygonTreeNode_1;
var hasRequiredPolygonTreeNode;
function requirePolygonTreeNode() {
  if (hasRequiredPolygonTreeNode) return PolygonTreeNode_1;
  hasRequiredPolygonTreeNode = 1;
  const { EPS } = requireConstants();
  const vec32 = requireVec3();
  const poly32 = requirePoly3();
  const splitPolygonByPlane = requireSplitPolygonByPlane();
  class PolygonTreeNode {
    // constructor creates the root node
    constructor(parent, polygon) {
      this.parent = parent;
      this.children = [];
      this.polygon = polygon;
      this.removed = false;
    }
    // fill the tree with polygons. Should be called on the root node only; child nodes must
    // always be a derivate (split) of the parent node.
    addPolygons(polygons) {
      if (!this.isRootNode()) {
        throw new Error("Assertion failed");
      }
      const _this = this;
      polygons.forEach((polygon) => {
        _this.addChild(polygon);
      });
    }
    // remove a node
    // - the siblings become toplevel nodes
    // - the parent is removed recursively
    remove() {
      if (!this.removed) {
        this.removed = true;
        this.polygon = null;
        this.parent.recursivelyInvalidatePolygon();
      }
    }
    isRemoved() {
      return this.removed;
    }
    isRootNode() {
      return !this.parent;
    }
    // invert all polygons in the tree. Call on the root node
    invert() {
      if (!this.isRootNode()) throw new Error("Assertion failed");
      this.invertSub();
    }
    getPolygon() {
      if (!this.polygon) throw new Error("Assertion failed");
      return this.polygon;
    }
    getPolygons(result) {
      if (this.isRootNode() && this.children.length > 0) {
        const compacted = [];
        for (let i2 = 0; i2 < this.children.length; i2++) {
          if (!this.children[i2].removed) compacted.push(this.children[i2]);
        }
        this.children = compacted;
      }
      let children2 = [this];
      const queue = [children2];
      let i, j, l, node;
      for (i = 0; i < queue.length; ++i) {
        children2 = queue[i];
        for (j = 0, l = children2.length; j < l; j++) {
          node = children2[j];
          if (node.polygon) {
            result.push(node.polygon);
          } else {
            if (node.children.length > 0) queue.push(node.children);
          }
        }
      }
    }
    // split the node by a plane; add the resulting nodes to the frontnodes and backnodes array
    // If the plane doesn't intersect the polygon, the 'this' object is added to one of the arrays
    // If the plane does intersect the polygon, two new child nodes are created for the front and back fragments,
    //  and added to both arrays.
    splitByPlane(plane2, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
      if (this.children.length) {
        const queue = [this.children];
        let i;
        let j;
        let l;
        let node;
        let nodes;
        for (i = 0; i < queue.length; i++) {
          nodes = queue[i];
          for (j = 0, l = nodes.length; j < l; j++) {
            node = nodes[j];
            if (node.children.length > 0) {
              queue.push(node.children);
            } else {
              node._splitByPlane(plane2, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
            }
          }
        }
      } else {
        this._splitByPlane(plane2, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes);
      }
    }
    // only to be called for nodes with no children
    _splitByPlane(splane, coplanarfrontnodes, coplanarbacknodes, frontnodes, backnodes) {
      const polygon = this.polygon;
      if (polygon) {
        const bound = poly32.measureBoundingSphere(polygon);
        const sphereradius = bound[3] + EPS;
        const spherecenter = bound;
        const d = vec32.dot(splane, spherecenter) - splane[3];
        if (d > sphereradius) {
          frontnodes.push(this);
        } else if (d < -sphereradius) {
          backnodes.push(this);
        } else {
          const splitresult = splitPolygonByPlane(splane, polygon);
          switch (splitresult.type) {
            case 0:
              coplanarfrontnodes.push(this);
              break;
            case 1:
              coplanarbacknodes.push(this);
              break;
            case 2:
              frontnodes.push(this);
              break;
            case 3:
              backnodes.push(this);
              break;
            case 4:
              if (splitresult.front) {
                const frontnode = this.addChild(splitresult.front);
                frontnodes.push(frontnode);
              }
              if (splitresult.back) {
                const backnode = this.addChild(splitresult.back);
                backnodes.push(backnode);
              }
              break;
          }
        }
      }
    }
    // PRIVATE methods from here:
    // add child to a node
    // this should be called whenever the polygon is split
    // a child should be created for every fragment of the split polygon
    // returns the newly created child
    addChild(polygon) {
      const newchild = new PolygonTreeNode(this, polygon);
      this.children.push(newchild);
      return newchild;
    }
    invertSub() {
      let children2 = [this];
      const queue = [children2];
      let i, j, l, node;
      for (i = 0; i < queue.length; i++) {
        children2 = queue[i];
        for (j = 0, l = children2.length; j < l; j++) {
          node = children2[j];
          if (node.polygon) {
            node.polygon = poly32.invert(node.polygon);
          }
          if (node.children.length > 0) queue.push(node.children);
        }
      }
    }
    // private method
    // remove the polygon from the node, and all parent nodes above it
    // called to invalidate parents of removed nodes
    recursivelyInvalidatePolygon() {
      this.polygon = null;
      if (this.parent) {
        this.parent.recursivelyInvalidatePolygon();
      }
    }
    clear() {
      let children2 = [this];
      const queue = [children2];
      for (let i = 0; i < queue.length; ++i) {
        children2 = queue[i];
        const l = children2.length;
        for (let j = 0; j < l; j++) {
          const node = children2[j];
          if (node.polygon) {
            node.polygon = null;
          }
          if (node.parent) {
            node.parent = null;
          }
          if (node.children.length > 0) queue.push(node.children);
          node.children = [];
        }
      }
    }
    toString() {
      let result = "";
      let children2 = [this];
      const queue = [children2];
      let i, j, l, node;
      for (i = 0; i < queue.length; ++i) {
        children2 = queue[i];
        const prefix = " ".repeat(i);
        for (j = 0, l = children2.length; j < l; j++) {
          node = children2[j];
          result += `${prefix}PolygonTreeNode (${node.isRootNode()}): ${node.children.length}`;
          if (node.polygon) {
            result += `
 ${prefix}polygon: ${node.polygon.vertices}
`;
          } else {
            result += "\n";
          }
          if (node.children.length > 0) queue.push(node.children);
        }
      }
      return result;
    }
  }
  PolygonTreeNode_1 = PolygonTreeNode;
  return PolygonTreeNode_1;
}
var Tree_1;
var hasRequiredTree;
function requireTree() {
  if (hasRequiredTree) return Tree_1;
  hasRequiredTree = 1;
  const Node = requireNode();
  const PolygonTreeNode = requirePolygonTreeNode();
  class Tree {
    constructor(polygons) {
      this.polygonTree = new PolygonTreeNode();
      this.rootnode = new Node(null);
      if (polygons) this.addPolygons(polygons);
    }
    invert() {
      this.polygonTree.invert();
      this.rootnode.invert();
    }
    // Remove all polygons in this BSP tree that are inside the other BSP tree
    // `tree`.
    clipTo(tree, alsoRemovecoplanarFront = false) {
      this.rootnode.clipTo(tree, alsoRemovecoplanarFront);
    }
    allPolygons() {
      const result = [];
      this.polygonTree.getPolygons(result);
      return result;
    }
    addPolygons(polygons) {
      const polygontreenodes = new Array(polygons.length);
      for (let i = 0; i < polygons.length; i++) {
        polygontreenodes[i] = this.polygonTree.addChild(polygons[i]);
      }
      this.rootnode.addPolygonTreeNodes(polygontreenodes);
    }
    clear() {
      this.polygonTree.clear();
    }
    toString() {
      const result = "Tree: " + this.polygonTree.toString("");
      return result;
    }
  }
  Tree_1 = Tree;
  return Tree_1;
}
var trees;
var hasRequiredTrees;
function requireTrees() {
  if (hasRequiredTrees) return trees;
  hasRequiredTrees = 1;
  trees = {
    Tree: requireTree()
  };
  return trees;
}
var intersectGeom3Sub_1;
var hasRequiredIntersectGeom3Sub;
function requireIntersectGeom3Sub() {
  if (hasRequiredIntersectGeom3Sub) return intersectGeom3Sub_1;
  hasRequiredIntersectGeom3Sub = 1;
  const geom32 = requireGeom3();
  const mayOverlap = requireMayOverlap();
  const { Tree } = requireTrees();
  const intersectGeom3Sub = (geometry1, geometry2) => {
    if (!mayOverlap(geometry1, geometry2)) {
      return geom32.create();
    }
    const a = new Tree(geom32.toPolygons(geometry1));
    const b = new Tree(geom32.toPolygons(geometry2));
    a.invert();
    b.clipTo(a);
    b.invert();
    a.clipTo(b);
    b.clipTo(a);
    a.addPolygons(b.allPolygons());
    a.invert();
    const newpolygons = a.allPolygons();
    return geom32.create(newpolygons);
  };
  intersectGeom3Sub_1 = intersectGeom3Sub;
  return intersectGeom3Sub_1;
}
var intersectGeom3;
var hasRequiredIntersectGeom3;
function requireIntersectGeom3() {
  if (hasRequiredIntersectGeom3) return intersectGeom3;
  hasRequiredIntersectGeom3 = 1;
  const flatten = requireFlatten();
  const retessellate = requireRetessellate();
  const intersectSub = requireIntersectGeom3Sub();
  const intersect = (...geometries2) => {
    geometries2 = flatten(geometries2);
    let newgeometry = geometries2.shift();
    geometries2.forEach((geometry) => {
      newgeometry = intersectSub(newgeometry, geometry);
    });
    newgeometry = retessellate(newgeometry);
    return newgeometry;
  };
  intersectGeom3 = intersect;
  return intersectGeom3;
}
var intersectGeom2;
var hasRequiredIntersectGeom2;
function requireIntersectGeom2() {
  if (hasRequiredIntersectGeom2) return intersectGeom2;
  hasRequiredIntersectGeom2 = 1;
  const flatten = requireFlatten();
  const geom32 = requireGeom3();
  const measureEpsilon = requireMeasureEpsilon();
  const fromFakePolygons = requireFromFakePolygons();
  const to3DWalls = requireTo3DWalls();
  const intersectGeom32 = requireIntersectGeom3();
  const intersect = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const newgeometries = geometries2.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry));
    const newgeom3 = intersectGeom32(newgeometries);
    const epsilon = measureEpsilon(newgeom3);
    return fromFakePolygons(epsilon, geom32.toPolygons(newgeom3));
  };
  intersectGeom2 = intersect;
  return intersectGeom2;
}
var intersect_1;
var hasRequiredIntersect;
function requireIntersect() {
  if (hasRequiredIntersect) return intersect_1;
  hasRequiredIntersect = 1;
  const flatten = requireFlatten();
  const areAllShapesTheSameType = requireAreAllShapesTheSameType();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const intersectGeom22 = requireIntersectGeom2();
  const intersectGeom32 = requireIntersectGeom3();
  const intersect = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType(geometries2)) {
      throw new Error("only intersect of the types are supported");
    }
    const geometry = geometries2[0];
    if (geom22.isA(geometry)) return intersectGeom22(geometries2);
    if (geom32.isA(geometry)) return intersectGeom32(geometries2);
    return geometry;
  };
  intersect_1 = intersect;
  return intersect_1;
}
var hullPoints3_1;
var hasRequiredHullPoints3;
function requireHullPoints3() {
  if (hasRequiredHullPoints3) return hullPoints3_1;
  hasRequiredHullPoints3 = 1;
  const poly32 = requirePoly3();
  const quickhull2 = requireQuickhull();
  const hullPoints3 = (uniquePoints) => {
    const faces = quickhull2(uniquePoints, { skipTriangulation: true });
    const polygons = faces.map((face) => {
      const vertices = face.map((index) => uniquePoints[index]);
      return poly32.create(vertices);
    });
    return polygons;
  };
  hullPoints3_1 = hullPoints3;
  return hullPoints3_1;
}
var unionGeom3Sub;
var hasRequiredUnionGeom3Sub;
function requireUnionGeom3Sub() {
  if (hasRequiredUnionGeom3Sub) return unionGeom3Sub;
  hasRequiredUnionGeom3Sub = 1;
  const geom32 = requireGeom3();
  const mayOverlap = requireMayOverlap();
  const { Tree } = requireTrees();
  const unionSub = (geometry1, geometry2) => {
    if (!mayOverlap(geometry1, geometry2)) {
      return unionForNonIntersecting(geometry1, geometry2);
    }
    const a = new Tree(geom32.toPolygons(geometry1));
    const b = new Tree(geom32.toPolygons(geometry2));
    a.clipTo(b, false);
    b.clipTo(a);
    b.invert();
    b.clipTo(a);
    b.invert();
    const newpolygons = a.allPolygons().concat(b.allPolygons());
    const result = geom32.create(newpolygons);
    return result;
  };
  const unionForNonIntersecting = (geometry1, geometry2) => {
    let newpolygons = geom32.toPolygons(geometry1);
    newpolygons = newpolygons.concat(geom32.toPolygons(geometry2));
    return geom32.create(newpolygons);
  };
  unionGeom3Sub = unionSub;
  return unionGeom3Sub;
}
var unionGeom3;
var hasRequiredUnionGeom3;
function requireUnionGeom3() {
  if (hasRequiredUnionGeom3) return unionGeom3;
  hasRequiredUnionGeom3 = 1;
  const flatten = requireFlatten();
  const retessellate = requireRetessellate();
  const unionSub = requireUnionGeom3Sub();
  const union = (...geometries2) => {
    geometries2 = flatten(geometries2);
    let i;
    for (i = 1; i < geometries2.length; i += 2) {
      geometries2.push(unionSub(geometries2[i - 1], geometries2[i]));
    }
    let newgeometry = geometries2[i - 1];
    newgeometry = retessellate(newgeometry);
    return newgeometry;
  };
  unionGeom3 = union;
  return unionGeom3;
}
var minkowskiSum_1;
var hasRequiredMinkowskiSum;
function requireMinkowskiSum() {
  if (hasRequiredMinkowskiSum) return minkowskiSum_1;
  hasRequiredMinkowskiSum = 1;
  const flatten = requireFlatten();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const hullPoints3 = requireHullPoints3();
  const unionGeom32 = requireUnionGeom3();
  const minkowskiSum = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length !== 2) {
      throw new Error("minkowskiSum requires exactly two geometries");
    }
    const [geomA, geomB] = geometries2;
    if (!geom32.isA(geomA) || !geom32.isA(geomB)) {
      throw new Error("minkowskiSum requires geom3 geometries");
    }
    const aConvex = geom32.isConvex(geomA);
    const bConvex = geom32.isConvex(geomB);
    if (aConvex && bConvex) {
      return minkowskiSumConvex(geomA, geomB);
    }
    if (!aConvex && bConvex) {
      return minkowskiSumNonConvexConvex(geomA, geomB);
    }
    if (aConvex && !bConvex) {
      return minkowskiSumNonConvexConvex(geomB, geomA);
    }
    throw new Error("minkowskiSum of two non-convex geometries is not yet supported");
  };
  const minkowskiSumNonConvexConvex = (geomA, geomB) => {
    const tetrahedra = decomposeIntoTetrahedra(geomA);
    if (tetrahedra.length === 0) {
      return geom32.create();
    }
    const parts = tetrahedra.map((tet) => minkowskiSumConvex(tet, geomB));
    if (parts.length === 1) {
      return parts[0];
    }
    return unionGeom32(parts);
  };
  const decomposeIntoTetrahedra = (geometry) => {
    const polygons = geom32.toPolygons(geometry);
    if (polygons.length === 0) {
      return [];
    }
    const tetrahedra = [];
    for (let i = 0; i < polygons.length; i++) {
      const polygon = polygons[i];
      const vertices = polygon.vertices;
      let cx = 0, cy = 0, cz = 0;
      for (let k = 0; k < vertices.length; k++) {
        cx += vertices[k][0];
        cy += vertices[k][1];
        cz += vertices[k][2];
      }
      cx /= vertices.length;
      cy /= vertices.length;
      cz /= vertices.length;
      const plane2 = poly32.plane(polygon);
      const nx = plane2[0], ny = plane2[1], nz = plane2[2];
      const offset = 0.1;
      const apex = [
        // Vertex used as apex in tetrahedron polygons below
        cx - nx * offset,
        cy - ny * offset,
        cz - nz * offset
      ];
      for (let j = 1; j < vertices.length - 1; j++) {
        const v0 = vertices[0];
        const v1 = vertices[j];
        const v22 = vertices[j + 1];
        const tetPolygons = createTetrahedronPolygons(apex, v0, v1, v22);
        tetrahedra.push(geom32.create(tetPolygons));
      }
    }
    return tetrahedra;
  };
  const createTetrahedronPolygons = (p0, p1, p2, p3) => {
    return [
      poly32.create([p0, p2, p1]),
      // base seen from p3
      poly32.create([p0, p1, p3]),
      // face opposite p2
      poly32.create([p1, p2, p3]),
      // face opposite p0
      poly32.create([p2, p0, p3])
      // face opposite p1
    ];
  };
  const minkowskiSumConvex = (geomA, geomB) => {
    const pointsA = extractUniqueVertices(geomA);
    const pointsB = extractUniqueVertices(geomB);
    if (pointsA.length === 0 || pointsB.length === 0) {
      return geom32.create();
    }
    const summedPoints = [];
    for (let i = 0; i < pointsA.length; i++) {
      const a = pointsA[i];
      for (let j = 0; j < pointsB.length; j++) {
        const b = pointsB[j];
        summedPoints.push([a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
      }
    }
    const hullPolygons = hullPoints3(summedPoints);
    return geom32.create(hullPolygons);
  };
  const extractUniqueVertices = (geometry) => {
    const found = /* @__PURE__ */ new Set();
    const unique = [];
    const polygons = geom32.toPolygons(geometry);
    for (let i = 0; i < polygons.length; i++) {
      const vertices = polygons[i].vertices;
      for (let j = 0; j < vertices.length; j++) {
        const v = vertices[j];
        const key = `${v[0]},${v[1]},${v[2]}`;
        if (!found.has(key)) {
          found.add(key);
          unique.push(v);
        }
      }
    }
    return unique;
  };
  minkowskiSum_1 = minkowskiSum;
  return minkowskiSum_1;
}
var scissionGeom3_1;
var hasRequiredScissionGeom3;
function requireScissionGeom3() {
  if (hasRequiredScissionGeom3) return scissionGeom3_1;
  hasRequiredScissionGeom3 = 1;
  const vec32 = requireVec3();
  const measureEpsilon = requireMeasureEpsilon();
  const geom32 = requireGeom3();
  const sortNb = (array) => array.sort((a, b) => a - b).filter((item, pos, ary) => !pos || item !== ary[pos - 1]);
  const insertMapping = (map, point, index) => {
    const key = `${point}`;
    const mapping = map.get(key);
    if (mapping === void 0) {
      map.set(key, [index]);
    } else {
      mapping.push(index);
    }
  };
  const findMapping = (map, point) => {
    const key = `${point}`;
    return map.get(key);
  };
  const scissionGeom3 = (geometry) => {
    const eps = measureEpsilon(geometry);
    const polygons = geom32.toPolygons(geometry);
    const pl = polygons.length;
    const indexesPerPoint = /* @__PURE__ */ new Map();
    const temp = vec32.create();
    polygons.forEach((polygon, index) => {
      polygon.vertices.forEach((point) => {
        insertMapping(indexesPerPoint, vec32.snap(temp, point, eps), index);
      });
    });
    const indexesPerPolygon = polygons.map((polygon) => {
      let indexes = [];
      polygon.vertices.forEach((point) => {
        indexes = indexes.concat(findMapping(indexesPerPoint, vec32.snap(temp, point, eps)));
      });
      return { e: 1, d: sortNb(indexes) };
    });
    indexesPerPoint.clear();
    let merges = 0;
    const ippl = indexesPerPolygon.length;
    for (let i = 0; i < ippl; i++) {
      const mapi = indexesPerPolygon[i];
      if (mapi.e > 0) {
        const indexes = new Array(pl);
        indexes[i] = true;
        do {
          merges = 0;
          indexes.forEach((e, j) => {
            const mapj = indexesPerPolygon[j];
            if (mapj.e > 0) {
              mapj.e = -1;
              for (let d = 0; d < mapj.d.length; d++) {
                indexes[mapj.d[d]] = true;
              }
              merges++;
            }
          });
        } while (merges > 0);
        mapi.indexes = indexes;
      }
    }
    const newgeometries = [];
    for (let i = 0; i < ippl; i++) {
      if (indexesPerPolygon[i].indexes) {
        const newpolygons = [];
        indexesPerPolygon[i].indexes.forEach((e, p) => newpolygons.push(polygons[p]));
        newgeometries.push(geom32.create(newpolygons));
      }
    }
    return newgeometries;
  };
  scissionGeom3_1 = scissionGeom3;
  return scissionGeom3_1;
}
var scission_1;
var hasRequiredScission;
function requireScission() {
  if (hasRequiredScission) return scission_1;
  hasRequiredScission = 1;
  const flatten = requireFlatten();
  const geom32 = requireGeom3();
  const scissionGeom3 = requireScissionGeom3();
  const scission = (...objects) => {
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (geom32.isA(object)) return scissionGeom3(object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  scission_1 = scission;
  return scission_1;
}
var subtractGeom3Sub_1;
var hasRequiredSubtractGeom3Sub;
function requireSubtractGeom3Sub() {
  if (hasRequiredSubtractGeom3Sub) return subtractGeom3Sub_1;
  hasRequiredSubtractGeom3Sub = 1;
  const geom32 = requireGeom3();
  const mayOverlap = requireMayOverlap();
  const { Tree } = requireTrees();
  const subtractGeom3Sub = (geometry1, geometry2) => {
    if (!mayOverlap(geometry1, geometry2)) {
      return geom32.clone(geometry1);
    }
    const a = new Tree(geom32.toPolygons(geometry1));
    const b = new Tree(geom32.toPolygons(geometry2));
    a.invert();
    a.clipTo(b);
    b.clipTo(a, true);
    a.addPolygons(b.allPolygons());
    a.invert();
    const newpolygons = a.allPolygons();
    return geom32.create(newpolygons);
  };
  subtractGeom3Sub_1 = subtractGeom3Sub;
  return subtractGeom3Sub_1;
}
var subtractGeom3;
var hasRequiredSubtractGeom3;
function requireSubtractGeom3() {
  if (hasRequiredSubtractGeom3) return subtractGeom3;
  hasRequiredSubtractGeom3 = 1;
  const flatten = requireFlatten();
  const retessellate = requireRetessellate();
  const subtractSub = requireSubtractGeom3Sub();
  const subtract = (...geometries2) => {
    geometries2 = flatten(geometries2);
    let newgeometry = geometries2.shift();
    geometries2.forEach((geometry) => {
      newgeometry = subtractSub(newgeometry, geometry);
    });
    newgeometry = retessellate(newgeometry);
    return newgeometry;
  };
  subtractGeom3 = subtract;
  return subtractGeom3;
}
var subtractGeom2;
var hasRequiredSubtractGeom2;
function requireSubtractGeom2() {
  if (hasRequiredSubtractGeom2) return subtractGeom2;
  hasRequiredSubtractGeom2 = 1;
  const flatten = requireFlatten();
  const geom32 = requireGeom3();
  const measureEpsilon = requireMeasureEpsilon();
  const fromFakePolygons = requireFromFakePolygons();
  const to3DWalls = requireTo3DWalls();
  const subtractGeom32 = requireSubtractGeom3();
  const subtract = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const newgeometries = geometries2.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry));
    const newgeom3 = subtractGeom32(newgeometries);
    const epsilon = measureEpsilon(newgeom3);
    return fromFakePolygons(epsilon, geom32.toPolygons(newgeom3));
  };
  subtractGeom2 = subtract;
  return subtractGeom2;
}
var subtract_1;
var hasRequiredSubtract;
function requireSubtract() {
  if (hasRequiredSubtract) return subtract_1;
  hasRequiredSubtract = 1;
  const flatten = requireFlatten();
  const areAllShapesTheSameType = requireAreAllShapesTheSameType();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const subtractGeom22 = requireSubtractGeom2();
  const subtractGeom32 = requireSubtractGeom3();
  const subtract = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType(geometries2)) {
      throw new Error("only subtract of the types are supported");
    }
    const geometry = geometries2[0];
    if (geom22.isA(geometry)) return subtractGeom22(geometries2);
    if (geom32.isA(geometry)) return subtractGeom32(geometries2);
    return geometry;
  };
  subtract_1 = subtract;
  return subtract_1;
}
var unionGeom2;
var hasRequiredUnionGeom2;
function requireUnionGeom2() {
  if (hasRequiredUnionGeom2) return unionGeom2;
  hasRequiredUnionGeom2 = 1;
  const flatten = requireFlatten();
  const geom32 = requireGeom3();
  const measureEpsilon = requireMeasureEpsilon();
  const fromFakePolygons = requireFromFakePolygons();
  const to3DWalls = requireTo3DWalls();
  const unionGeom32 = requireUnionGeom3();
  const union = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const newgeometries = geometries2.map((geometry) => to3DWalls({ z0: -1, z1: 1 }, geometry));
    const newgeom3 = unionGeom32(newgeometries);
    const epsilon = measureEpsilon(newgeom3);
    return fromFakePolygons(epsilon, geom32.toPolygons(newgeom3));
  };
  unionGeom2 = union;
  return unionGeom2;
}
var union_1;
var hasRequiredUnion;
function requireUnion() {
  if (hasRequiredUnion) return union_1;
  hasRequiredUnion = 1;
  const flatten = requireFlatten();
  const areAllShapesTheSameType = requireAreAllShapesTheSameType();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const unionGeom22 = requireUnionGeom2();
  const unionGeom32 = requireUnionGeom3();
  const union = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType(geometries2)) {
      throw new Error("only unions of the same type are supported");
    }
    const geometry = geometries2[0];
    if (geom22.isA(geometry)) return unionGeom22(geometries2);
    if (geom32.isA(geometry)) return unionGeom32(geometries2);
    return geometry;
  };
  union_1 = union;
  return union_1;
}
var booleans;
var hasRequiredBooleans;
function requireBooleans() {
  if (hasRequiredBooleans) return booleans;
  hasRequiredBooleans = 1;
  booleans = {
    intersect: requireIntersect(),
    minkowski: requireMinkowskiSum(),
    scission: requireScission(),
    subtract: requireSubtract(),
    union: requireUnion()
  };
  return booleans;
}
var offsetFromPoints_1;
var hasRequiredOffsetFromPoints;
function requireOffsetFromPoints() {
  if (hasRequiredOffsetFromPoints) return offsetFromPoints_1;
  hasRequiredOffsetFromPoints = 1;
  const { EPS, TAU } = requireConstants();
  const intersect = requireIntersect$1();
  const line22 = requireLine2();
  const vec22 = requireVec2();
  const area = requireArea();
  const offsetFromPoints = (options, points) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      closed: false,
      segments: 16
    };
    let { delta, corners, closed, segments } = Object.assign({}, defaults, options);
    if (Math.abs(delta) < EPS) return points;
    let rotation = options.closed ? area(points) : 1;
    if (rotation === 0) rotation = 1;
    const orientation = rotation > 0 && delta >= 0 || rotation < 0 && delta < 0;
    delta = Math.abs(delta);
    let previousSegment = null;
    let newPoints = [];
    const newCorners = [];
    const of = vec22.create();
    const n = points.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const p0 = points[i];
      const p1 = points[j];
      orientation ? vec22.subtract(of, p0, p1) : vec22.subtract(of, p1, p0);
      vec22.normal(of, of);
      vec22.normalize(of, of);
      vec22.scale(of, of, delta);
      const n0 = vec22.add(vec22.create(), p0, of);
      const n1 = vec22.add(vec22.create(), p1, of);
      const currentSegment = [n0, n1];
      if (previousSegment != null) {
        if (closed || !closed && j !== 0) {
          const ip = intersect(previousSegment[0], previousSegment[1], currentSegment[0], currentSegment[1]);
          if (ip) {
            newPoints.pop();
            currentSegment[0] = ip;
          } else {
            newCorners.push({ c: p0, s0: previousSegment, s1: currentSegment });
          }
        }
      }
      previousSegment = [n0, n1];
      if (j === 0 && !closed) continue;
      newPoints.push(currentSegment[0]);
      newPoints.push(currentSegment[1]);
    }
    if (closed && previousSegment != null) {
      const n0 = newPoints[0];
      const n1 = newPoints[1];
      const ip = intersect(previousSegment[0], previousSegment[1], n0, n1);
      if (ip) {
        newPoints[0] = ip;
        newPoints.pop();
      } else {
        const p0 = points[0];
        const cursegment = [n0, n1];
        newCorners.push({ c: p0, s0: previousSegment, s1: cursegment });
      }
    }
    if (corners === "edge") {
      const pointIndex = /* @__PURE__ */ new Map();
      newPoints.forEach((point, index) => pointIndex.set(point, index));
      const line0 = line22.create();
      const line1 = line22.create();
      newCorners.forEach((corner) => {
        line22.fromPoints(line0, corner.s0[0], corner.s0[1]);
        line22.fromPoints(line1, corner.s1[0], corner.s1[1]);
        const ip = line22.intersectPointOfLines(line0, line1);
        if (Number.isFinite(ip[0]) && Number.isFinite(ip[1])) {
          const p0 = corner.s0[1];
          const i = pointIndex.get(p0);
          newPoints[i] = ip;
          newPoints[(i + 1) % newPoints.length] = void 0;
        } else {
          const p0 = corner.s1[0];
          const i = pointIndex.get(p0);
          newPoints[i] = void 0;
        }
      });
      newPoints = newPoints.filter((p) => p !== void 0);
    }
    if (corners === "round") {
      let cornersegments = Math.floor(segments / 4);
      const v0 = vec22.create();
      newCorners.forEach((corner) => {
        let rotation2 = vec22.angle(vec22.subtract(v0, corner.s1[0], corner.c));
        rotation2 -= vec22.angle(vec22.subtract(v0, corner.s0[1], corner.c));
        if (orientation && rotation2 < 0) {
          rotation2 = rotation2 + Math.PI;
          if (rotation2 < 0) rotation2 = rotation2 + Math.PI;
        }
        if (!orientation && rotation2 > 0) {
          rotation2 = rotation2 - Math.PI;
          if (rotation2 > 0) rotation2 = rotation2 - Math.PI;
        }
        if (rotation2 !== 0) {
          cornersegments = Math.floor(segments * (Math.abs(rotation2) / TAU));
          const step = rotation2 / cornersegments;
          const start = vec22.angle(vec22.subtract(v0, corner.s0[1], corner.c));
          const cornerpoints = [];
          for (let i = 1; i < cornersegments; i++) {
            const radians = start + step * i;
            const point = vec22.fromAngleRadians(vec22.create(), radians);
            vec22.scale(point, point, delta);
            vec22.add(point, point, corner.c);
            cornerpoints.push(point);
          }
          if (cornerpoints.length > 0) {
            const p0 = corner.s0[1];
            let i = newPoints.findIndex((point) => vec22.equals(p0, point));
            i = (i + 1) % newPoints.length;
            newPoints.splice(i, 0, ...cornerpoints);
          }
        } else {
          const p0 = corner.s1[0];
          const i = newPoints.findIndex((point) => vec22.equals(p0, point));
          newPoints.splice(i, 1);
        }
      });
    }
    return newPoints;
  };
  offsetFromPoints_1 = offsetFromPoints;
  return offsetFromPoints_1;
}
var expandGeom2_1;
var hasRequiredExpandGeom2;
function requireExpandGeom2() {
  if (hasRequiredExpandGeom2) return expandGeom2_1;
  hasRequiredExpandGeom2 = 1;
  const geom22 = requireGeom2();
  const offsetFromPoints = requireOffsetFromPoints();
  const expandGeom2 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      segments: 16
    };
    const { delta, corners, segments } = Object.assign({}, defaults, options);
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    const outlines = geom22.toOutlines(geometry);
    const newoutlines = outlines.map((outline) => {
      options = {
        delta,
        corners,
        closed: true,
        segments
      };
      return offsetFromPoints(options, outline);
    });
    const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom22.toSides(geom22.fromPoints(newoutline))), []);
    return geom22.create(allsides);
  };
  expandGeom2_1 = expandGeom2;
  return expandGeom2_1;
}
var extrudePolygon_1;
var hasRequiredExtrudePolygon;
function requireExtrudePolygon() {
  if (hasRequiredExtrudePolygon) return extrudePolygon_1;
  hasRequiredExtrudePolygon = 1;
  const mat42 = requireMat4();
  const vec32 = requireVec3();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const extrudePolygon = (offsetvector, polygon1) => {
    const direction = vec32.dot(poly32.plane(polygon1), offsetvector);
    if (direction > 0) {
      polygon1 = poly32.invert(polygon1);
    }
    const newpolygons = [polygon1];
    const polygon2 = poly32.transform(mat42.fromTranslation(mat42.create(), offsetvector), polygon1);
    const numvertices = polygon1.vertices.length;
    for (let i = 0; i < numvertices; i++) {
      const nexti = i < numvertices - 1 ? i + 1 : 0;
      const sideFacePolygon = poly32.create([
        polygon1.vertices[i],
        polygon2.vertices[i],
        polygon2.vertices[nexti],
        polygon1.vertices[nexti]
      ]);
      newpolygons.push(sideFacePolygon);
    }
    newpolygons.push(poly32.invert(polygon2));
    return geom32.create(newpolygons);
  };
  extrudePolygon_1 = extrudePolygon;
  return extrudePolygon_1;
}
var expandShell_1;
var hasRequiredExpandShell;
function requireExpandShell() {
  if (hasRequiredExpandShell) return expandShell_1;
  hasRequiredExpandShell = 1;
  const { EPS, TAU } = requireConstants();
  const mat42 = requireMat4();
  const vec32 = requireVec3();
  const fnNumberSort = requireFnNumberSort();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const sphere = requireSphere();
  const retessellate = requireRetessellate();
  const unionGeom3Sub2 = requireUnionGeom3Sub();
  const extrudePolygon = requireExtrudePolygon();
  const mapPlaneToVertex = (map, vertex, plane2) => {
    const key = vertex.toString();
    if (!map.has(key)) {
      const entry = [vertex, [plane2]];
      map.set(key, entry);
    } else {
      const planes = map.get(key)[1];
      planes.push(plane2);
    }
  };
  const mapPlaneToEdge = (map, edge, plane2) => {
    const key0 = edge[0].toString();
    const key1 = edge[1].toString();
    const key = key0 < key1 ? `${key0},${key1}` : `${key1},${key0}`;
    if (!map.has(key)) {
      const entry = [edge, [plane2]];
      map.set(key, entry);
    } else {
      const planes = map.get(key)[1];
      planes.push(plane2);
    }
  };
  const addUniqueAngle = (map, angle2) => {
    const i = map.findIndex((item) => item === angle2);
    if (i < 0) {
      map.push(angle2);
    }
  };
  const expandShell = (options, geometry) => {
    const defaults = {
      delta: 1,
      segments: 12
    };
    const { delta, segments } = Object.assign({}, defaults, options);
    let result = geom32.create();
    const vertices2planes = /* @__PURE__ */ new Map();
    const edges2planes = /* @__PURE__ */ new Map();
    const v1 = vec32.create();
    const v22 = vec32.create();
    const polygons = geom32.toPolygons(geometry);
    polygons.forEach((polygon, index) => {
      const extrudevector = vec32.scale(vec32.create(), poly32.plane(polygon), 2 * delta);
      const translatedpolygon = poly32.transform(mat42.fromTranslation(mat42.create(), vec32.scale(vec32.create(), extrudevector, -0.5)), polygon);
      const extrudedface = extrudePolygon(extrudevector, translatedpolygon);
      result = unionGeom3Sub2(result, extrudedface);
      const vertices = polygon.vertices;
      for (let i = 0; i < vertices.length; i++) {
        mapPlaneToVertex(vertices2planes, vertices[i], poly32.plane(polygon));
        const j = (i + 1) % vertices.length;
        const edge = [vertices[i], vertices[j]];
        mapPlaneToEdge(edges2planes, edge, poly32.plane(polygon));
      }
    });
    edges2planes.forEach((item) => {
      const edge = item[0];
      const planes = item[1];
      const startpoint = edge[0];
      const endpoint = edge[1];
      const zbase = vec32.subtract(vec32.create(), endpoint, startpoint);
      vec32.normalize(zbase, zbase);
      const xbase = planes[0];
      const ybase = vec32.cross(vec32.create(), xbase, zbase);
      let angles = [];
      for (let i = 0; i < segments; i++) {
        addUniqueAngle(angles, i * TAU / segments);
      }
      for (let i = 0, iMax = planes.length; i < iMax; i++) {
        const planenormal = planes[i];
        const si = vec32.dot(ybase, planenormal);
        const co = vec32.dot(xbase, planenormal);
        let angle2 = Math.atan2(si, co);
        if (angle2 < 0) angle2 += TAU;
        addUniqueAngle(angles, angle2);
        angle2 = Math.atan2(-si, -co);
        if (angle2 < 0) angle2 += TAU;
        addUniqueAngle(angles, angle2);
      }
      angles = angles.sort(fnNumberSort);
      const numangles = angles.length;
      let prevp1;
      let prevp2;
      const startfacevertices = [];
      const endfacevertices = [];
      const polygons2 = [];
      for (let i = -1; i < numangles; i++) {
        const angle2 = angles[i < 0 ? i + numangles : i];
        const si = Math.sin(angle2);
        const co = Math.cos(angle2);
        vec32.scale(v1, xbase, co * delta);
        vec32.scale(v22, ybase, si * delta);
        vec32.add(v1, v1, v22);
        const p1 = vec32.add(vec32.create(), startpoint, v1);
        const p2 = vec32.add(vec32.create(), endpoint, v1);
        let skip = false;
        if (i >= 0) {
          if (vec32.distance(p1, prevp1) < EPS) {
            skip = true;
          }
        }
        if (!skip) {
          if (i >= 0) {
            startfacevertices.push(p1);
            endfacevertices.push(p2);
            const points = [prevp2, p2, p1, prevp1];
            const polygon = poly32.create(points);
            polygons2.push(polygon);
          }
          prevp1 = p1;
          prevp2 = p2;
        }
      }
      endfacevertices.reverse();
      polygons2.push(poly32.create(startfacevertices));
      polygons2.push(poly32.create(endfacevertices));
      const cylinder = geom32.create(polygons2);
      result = unionGeom3Sub2(result, cylinder);
    });
    vertices2planes.forEach((item) => {
      const vertex = item[0];
      const planes = item[1];
      const xaxis = planes[0];
      let bestzaxis = null;
      let bestzaxisorthogonality = 0;
      for (let i = 1; i < planes.length; i++) {
        const normal = planes[i];
        const cross = vec32.cross(v1, xaxis, normal);
        const crosslength = vec32.length(cross);
        if (crosslength > 0.05) {
          if (crosslength > bestzaxisorthogonality) {
            bestzaxisorthogonality = crosslength;
            bestzaxis = normal;
          }
        }
      }
      if (!bestzaxis) {
        bestzaxis = vec32.orthogonal(v1, xaxis);
      }
      const yaxis = vec32.cross(v1, xaxis, bestzaxis);
      vec32.normalize(yaxis, yaxis);
      const zaxis = vec32.cross(v22, yaxis, xaxis);
      const corner = sphere({
        center: [vertex[0], vertex[1], vertex[2]],
        radius: delta,
        segments,
        axes: [xaxis, yaxis, zaxis]
      });
      result = unionGeom3Sub2(result, corner);
    });
    return retessellate(result);
  };
  expandShell_1 = expandShell;
  return expandShell_1;
}
var expandGeom3_1;
var hasRequiredExpandGeom3;
function requireExpandGeom3() {
  if (hasRequiredExpandGeom3) return expandGeom3_1;
  hasRequiredExpandGeom3 = 1;
  const geom32 = requireGeom3();
  const union = requireUnion();
  const expandShell = requireExpandShell();
  const expandGeom3 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "round",
      segments: 12
    };
    const { delta, corners, segments } = Object.assign({}, defaults, options);
    if (!(corners === "round")) {
      throw new Error('corners must be "round" for 3D geometries');
    }
    const polygons = geom32.toPolygons(geometry);
    if (polygons.length === 0) throw new Error("the given geometry cannot be empty");
    options = { delta, corners, segments };
    const expanded = expandShell(options, geometry);
    return union(geometry, expanded);
  };
  expandGeom3_1 = expandGeom3;
  return expandGeom3_1;
}
var expandPath2_1;
var hasRequiredExpandPath2;
function requireExpandPath2() {
  if (hasRequiredExpandPath2) return expandPath2_1;
  hasRequiredExpandPath2 = 1;
  const area = requireArea();
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const path22 = requirePath2();
  const offsetFromPoints = requireOffsetFromPoints();
  const createGeometryFromClosedOffsets = (paths) => {
    let { external, internal } = paths;
    if (area(external) < 0) {
      external = external.reverse();
    } else {
      internal = internal.reverse();
    }
    const externalPath = path22.fromPoints({ closed: true }, external);
    const internalPath = path22.fromPoints({ closed: true }, internal);
    const externalSides = geom22.toSides(geom22.fromPoints(path22.toPoints(externalPath)));
    const internalSides = geom22.toSides(geom22.fromPoints(path22.toPoints(internalPath)));
    externalSides.push(...internalSides);
    return geom22.create(externalSides);
  };
  const createGeometryFromExpandedOpenPath = (paths, segments, corners, delta) => {
    const { points, external, internal } = paths;
    const capSegments = Math.floor(segments / 2);
    const e2iCap = [];
    const i2eCap = [];
    if (corners === "round" && capSegments > 0) {
      const step = Math.PI / capSegments;
      const eCorner = points[points.length - 1];
      const e2iStart = vec22.angle(vec22.subtract(vec22.create(), external[external.length - 1], eCorner));
      const iCorner = points[0];
      const i2eStart = vec22.angle(vec22.subtract(vec22.create(), internal[0], iCorner));
      for (let i = 1; i < capSegments; i++) {
        let radians = e2iStart + step * i;
        let point = vec22.fromAngleRadians(vec22.create(), radians);
        vec22.scale(point, point, delta);
        vec22.add(point, point, eCorner);
        e2iCap.push(point);
        radians = i2eStart + step * i;
        point = vec22.fromAngleRadians(vec22.create(), radians);
        vec22.scale(point, point, delta);
        vec22.add(point, point, iCorner);
        i2eCap.push(point);
      }
    }
    const allPoints = [];
    allPoints.push(...external, ...e2iCap, ...internal.reverse(), ...i2eCap);
    return geom22.fromPoints(allPoints);
  };
  const expandPath2 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      segments: 16
    };
    options = Object.assign({}, defaults, options);
    const { delta, corners, segments } = options;
    if (delta <= 0) throw new Error("the given delta must be positive for paths");
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    const closed = geometry.isClosed;
    const points = path22.toPoints(geometry);
    if (points.length === 0) throw new Error("the given geometry cannot be empty");
    const paths = {
      points,
      external: offsetFromPoints({ delta, corners, segments, closed }, points),
      internal: offsetFromPoints({ delta: -delta, corners, segments, closed }, points)
    };
    if (geometry.isClosed) {
      return createGeometryFromClosedOffsets(paths);
    } else {
      return createGeometryFromExpandedOpenPath(paths, segments, corners, delta);
    }
  };
  expandPath2_1 = expandPath2;
  return expandPath2_1;
}
var expand_1;
var hasRequiredExpand;
function requireExpand() {
  if (hasRequiredExpand) return expand_1;
  hasRequiredExpand = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const expandGeom2 = requireExpandGeom2();
  const expandGeom3 = requireExpandGeom3();
  const expandPath2 = requireExpandPath2();
  const expand = (options, ...objects) => {
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (path22.isA(object)) return expandPath2(options, object);
      if (geom22.isA(object)) return expandGeom2(options, object);
      if (geom32.isA(object)) return expandGeom3(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  expand_1 = expand;
  return expand_1;
}
var offsetGeom2_1;
var hasRequiredOffsetGeom2;
function requireOffsetGeom2() {
  if (hasRequiredOffsetGeom2) return offsetGeom2_1;
  hasRequiredOffsetGeom2 = 1;
  const geom22 = requireGeom2();
  const poly22 = requirePoly2();
  const offsetFromPoints = requireOffsetFromPoints();
  const offsetGeom2 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      segments: 0
    };
    const { delta, corners, segments } = Object.assign({}, defaults, options);
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    const outlines = geom22.toOutlines(geometry);
    const newoutlines = outlines.map((outline) => {
      const level = outlines.reduce((acc, polygon) => acc + poly22.arePointsInside(outline, poly22.create(polygon)), 0);
      const outside = level % 2 === 0;
      options = {
        delta: outside ? delta : -delta,
        corners,
        closed: true,
        segments
      };
      return offsetFromPoints(options, outline);
    });
    const allsides = newoutlines.reduce((sides, newoutline) => sides.concat(geom22.toSides(geom22.fromPoints(newoutline))), []);
    return geom22.create(allsides);
  };
  offsetGeom2_1 = offsetGeom2;
  return offsetGeom2_1;
}
var offsetPath2_1;
var hasRequiredOffsetPath2;
function requireOffsetPath2() {
  if (hasRequiredOffsetPath2) return offsetPath2_1;
  hasRequiredOffsetPath2 = 1;
  const path22 = requirePath2();
  const offsetFromPoints = requireOffsetFromPoints();
  const offsetPath2 = (options, geometry) => {
    const defaults = {
      delta: 1,
      corners: "edge",
      closed: geometry.isClosed,
      segments: 16
    };
    const { delta, corners, closed, segments } = Object.assign({}, defaults, options);
    if (!(corners === "edge" || corners === "chamfer" || corners === "round")) {
      throw new Error('corners must be "edge", "chamfer", or "round"');
    }
    options = { delta, corners, closed, segments };
    const newpoints = offsetFromPoints(options, path22.toPoints(geometry));
    return path22.fromPoints({ closed }, newpoints);
  };
  offsetPath2_1 = offsetPath2;
  return offsetPath2_1;
}
var offset_1;
var hasRequiredOffset;
function requireOffset() {
  if (hasRequiredOffset) return offset_1;
  hasRequiredOffset = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const path22 = requirePath2();
  const offsetGeom2 = requireOffsetGeom2();
  const offsetPath2 = requireOffsetPath2();
  const offset = (options, ...objects) => {
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (path22.isA(object)) return offsetPath2(options, object);
      if (geom22.isA(object)) return offsetGeom2(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  offset_1 = offset;
  return offset_1;
}
var expansions;
var hasRequiredExpansions;
function requireExpansions() {
  if (hasRequiredExpansions) return expansions;
  hasRequiredExpansions = 1;
  expansions = {
    expand: requireExpand(),
    offset: requireOffset()
  };
  return expansions;
}
var extrudeLinearGeom2;
var hasRequiredExtrudeLinearGeom2;
function requireExtrudeLinearGeom2() {
  if (hasRequiredExtrudeLinearGeom2) return extrudeLinearGeom2;
  hasRequiredExtrudeLinearGeom2 = 1;
  const mat42 = requireMat4();
  const vec32 = requireVec3();
  const geom22 = requireGeom2();
  const slice2 = requireSlice();
  const extrudeFromSlices = requireExtrudeFromSlices();
  const extrudeGeom2 = (options, geometry) => {
    const defaults = {
      offset: [0, 0, 1],
      twistAngle: 0,
      twistSteps: 12,
      repair: true
    };
    let { offset, twistAngle, twistSteps, repair } = Object.assign({}, defaults, options);
    if (twistSteps < 1) throw new Error("twistSteps must be 1 or more");
    if (twistAngle === 0) {
      twistSteps = 1;
    }
    const offsetv = vec32.clone(offset);
    const baseSides = geom22.toSides(geometry);
    if (baseSides.length === 0) throw new Error("the given geometry cannot be empty");
    const baseSlice = slice2.fromSides(baseSides);
    if (offsetv[2] < 0) slice2.reverse(baseSlice, baseSlice);
    const matrix = mat42.create();
    const createTwist = (progress, index, base) => {
      const Zrotation = index / twistSteps * twistAngle;
      const Zoffset = vec32.scale(vec32.create(), offsetv, index / twistSteps);
      mat42.multiply(matrix, mat42.fromZRotation(matrix, Zrotation), mat42.fromTranslation(mat42.create(), Zoffset));
      return slice2.transform(matrix, base);
    };
    options = {
      numberOfSlices: twistSteps + 1,
      capStart: true,
      capEnd: true,
      repair,
      callback: createTwist
    };
    return extrudeFromSlices(options, baseSlice);
  };
  extrudeLinearGeom2 = extrudeGeom2;
  return extrudeLinearGeom2;
}
var extrudeLinearPath2;
var hasRequiredExtrudeLinearPath2;
function requireExtrudeLinearPath2() {
  if (hasRequiredExtrudeLinearPath2) return extrudeLinearPath2;
  hasRequiredExtrudeLinearPath2 = 1;
  const geom22 = requireGeom2();
  const path22 = requirePath2();
  const extrudeLinearGeom22 = requireExtrudeLinearGeom2();
  const extrudePath2 = (options, geometry) => {
    if (!geometry.isClosed) throw new Error("extruded path must be closed");
    const points = path22.toPoints(geometry);
    const geometry2 = geom22.fromPoints(points);
    return extrudeLinearGeom22(options, geometry2);
  };
  extrudeLinearPath2 = extrudePath2;
  return extrudeLinearPath2;
}
var extrudeLinear_1;
var hasRequiredExtrudeLinear;
function requireExtrudeLinear() {
  if (hasRequiredExtrudeLinear) return extrudeLinear_1;
  hasRequiredExtrudeLinear = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const path22 = requirePath2();
  const extrudeLinearGeom22 = requireExtrudeLinearGeom2();
  const extrudeLinearPath22 = requireExtrudeLinearPath2();
  const extrudeLinear = (options, ...objects) => {
    const defaults = {
      height: 1,
      twistAngle: 0,
      twistSteps: 1,
      repair: true
    };
    const { height, twistAngle, twistSteps, repair } = Object.assign({}, defaults, options);
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    options = { offset: [0, 0, height], twistAngle, twistSteps, repair };
    const results = objects.map((object) => {
      if (path22.isA(object)) return extrudeLinearPath22(options, object);
      if (geom22.isA(object)) return extrudeLinearGeom22(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  extrudeLinear_1 = extrudeLinear;
  return extrudeLinear_1;
}
var extrudeRectangularPath2_1;
var hasRequiredExtrudeRectangularPath2;
function requireExtrudeRectangularPath2() {
  if (hasRequiredExtrudeRectangularPath2) return extrudeRectangularPath2_1;
  hasRequiredExtrudeRectangularPath2 = 1;
  const path22 = requirePath2();
  const expand = requireExpand();
  const extrudeLinearGeom22 = requireExtrudeLinearGeom2();
  const extrudeRectangularPath2 = (options, geometry) => {
    const defaults = {
      size: 1,
      height: 1
    };
    const { size, height } = Object.assign({}, defaults, options);
    options.delta = size;
    options.offset = [0, 0, height];
    const points = path22.toPoints(geometry);
    if (points.length === 0) throw new Error("the given geometry cannot be empty");
    const newgeometry = expand(options, geometry);
    return extrudeLinearGeom22(options, newgeometry);
  };
  extrudeRectangularPath2_1 = extrudeRectangularPath2;
  return extrudeRectangularPath2_1;
}
var extrudeRectangularGeom2_1;
var hasRequiredExtrudeRectangularGeom2;
function requireExtrudeRectangularGeom2() {
  if (hasRequiredExtrudeRectangularGeom2) return extrudeRectangularGeom2_1;
  hasRequiredExtrudeRectangularGeom2 = 1;
  const { area } = requireUtils$1();
  const geom22 = requireGeom2();
  const path22 = requirePath2();
  const expand = requireExpand();
  const extrudeLinearGeom22 = requireExtrudeLinearGeom2();
  const extrudeRectangularGeom2 = (options, geometry) => {
    const defaults = {
      size: 1,
      height: 1
    };
    const { size, height } = Object.assign({}, defaults, options);
    options.delta = size;
    options.offset = [0, 0, height];
    const outlines = geom22.toOutlines(geometry);
    if (outlines.length === 0) throw new Error("the given geometry cannot be empty");
    const newparts = outlines.map((outline) => {
      if (area(outline) < 0) outline.reverse();
      return expand(options, path22.fromPoints({ closed: true }, outline));
    });
    const allsides = newparts.reduce((sides, part) => sides.concat(geom22.toSides(part)), []);
    const newgeometry = geom22.create(allsides);
    return extrudeLinearGeom22(options, newgeometry);
  };
  extrudeRectangularGeom2_1 = extrudeRectangularGeom2;
  return extrudeRectangularGeom2_1;
}
var extrudeRectangular_1;
var hasRequiredExtrudeRectangular;
function requireExtrudeRectangular() {
  if (hasRequiredExtrudeRectangular) return extrudeRectangular_1;
  hasRequiredExtrudeRectangular = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const path22 = requirePath2();
  const extrudeRectangularPath2 = requireExtrudeRectangularPath2();
  const extrudeRectangularGeom2 = requireExtrudeRectangularGeom2();
  const extrudeRectangular = (options, ...objects) => {
    const defaults = {
      size: 1,
      height: 1
    };
    const { size, height } = Object.assign({}, defaults, options);
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    if (size <= 0) throw new Error("size must be positive");
    if (height <= 0) throw new Error("height must be positive");
    const results = objects.map((object) => {
      if (path22.isA(object)) return extrudeRectangularPath2(options, object);
      if (geom22.isA(object)) return extrudeRectangularGeom2(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  extrudeRectangular_1 = extrudeRectangular;
  return extrudeRectangular_1;
}
var extrudeHelical_1;
var hasRequiredExtrudeHelical;
function requireExtrudeHelical() {
  if (hasRequiredExtrudeHelical) return extrudeHelical_1;
  hasRequiredExtrudeHelical = 1;
  const { TAU } = requireConstants();
  const mat42 = requireMat4();
  const geom22 = requireGeom2();
  const extrudeFromSlices = requireExtrudeFromSlices();
  const slice2 = requireSlice();
  const extrudeHelical = (options, geometry) => {
    const defaults = {
      angle: TAU,
      startAngle: 0,
      pitch: 10,
      height: 0,
      endOffset: 0,
      segmentsPerRotation: 32
    };
    let { angle: angle2, startAngle, pitch, height, endOffset, segmentsPerRotation } = Object.assign({}, defaults, options);
    if (height != 0) {
      pitch = height / (angle2 / TAU);
    }
    const minNumberOfSegments = 3;
    if (segmentsPerRotation < minNumberOfSegments) {
      throw new Error("The number of segments per rotation needs to be at least 3.");
    }
    const shapeSides = geom22.toSides(geometry);
    if (shapeSides.length === 0) throw new Error("The given geometry cannot be empty");
    const pointsWithPositiveX = shapeSides.filter((s) => s[0][0] >= 0);
    let baseSlice = slice2.fromSides(shapeSides);
    if (pointsWithPositiveX.length === 0) {
      baseSlice = slice2.reverse(baseSlice);
    }
    const calculatedSegments = Math.round(segmentsPerRotation / TAU * Math.abs(angle2));
    const segments = calculatedSegments >= 2 ? calculatedSegments : 2;
    const step1 = mat42.create();
    const step2 = mat42.create();
    const sliceCallback = (progress, index, base) => {
      const zRotation = startAngle + angle2 / segments * index;
      const xOffset = endOffset / segments * index;
      const zOffset = (zRotation - startAngle) / TAU * pitch;
      mat42.multiply(
        step1,
        // then apply offsets
        mat42.fromTranslation(mat42.create(), [xOffset, 0, zOffset * Math.sign(angle2)]),
        // first rotate "flat" 2D shape from XY to XZ plane
        mat42.fromXRotation(mat42.create(), -TAU / 4 * Math.sign(angle2))
        // rotate the slice correctly to not create inside-out polygon
      );
      mat42.multiply(
        step2,
        // finally rotate around Z axis
        mat42.fromZRotation(mat42.create(), zRotation),
        step1
      );
      return slice2.transform(step2, base);
    };
    return extrudeFromSlices(
      {
        // "base" slice is counted as segment, so add one for complete final rotation
        numberOfSlices: segments + 1,
        callback: sliceCallback
      },
      baseSlice
    );
  };
  extrudeHelical_1 = extrudeHelical;
  return extrudeHelical_1;
}
var project_1;
var hasRequiredProject;
function requireProject() {
  if (hasRequiredProject) return project_1;
  hasRequiredProject = 1;
  const flatten = requireFlatten();
  const aboutEqualNormals = requireAboutEqualNormals();
  const plane2 = requirePlane$1();
  const mat42 = requireMat4();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const poly32 = requirePoly3();
  const measureEpsilon = requireMeasureEpsilon();
  const unionGeom22 = requireUnionGeom2();
  const projectGeom3 = (options, geometry) => {
    const projplane = plane2.fromNormalAndPoint(plane2.create(), options.axis, options.origin);
    if (Number.isNaN(projplane[0]) || Number.isNaN(projplane[1]) || Number.isNaN(projplane[2]) || Number.isNaN(projplane[3])) {
      throw new Error("project: invalid axis or origin");
    }
    const epsilon = measureEpsilon(geometry);
    const epsilonArea = epsilon * epsilon * Math.sqrt(3) / 4;
    if (epsilon === 0) return geom22.create();
    const polygons = geom32.toPolygons(geometry);
    let projpolys = [];
    for (let i = 0; i < polygons.length; i++) {
      const newpoints = polygons[i].vertices.map((v) => plane2.projectionOfPoint(projplane, v));
      const newpoly = poly32.create(newpoints);
      const newplane = poly32.plane(newpoly);
      if (!aboutEqualNormals(projplane, newplane)) continue;
      if (poly32.measureArea(newpoly) < epsilonArea) continue;
      projpolys.push(newpoly);
    }
    if (!aboutEqualNormals(projplane, [0, 0, 1])) {
      const rotation = mat42.fromVectorRotation(mat42.create(), projplane, [0, 0, 1]);
      projpolys = projpolys.map((p) => poly32.transform(rotation, p));
    }
    projpolys = projpolys.sort((a, b) => poly32.measureArea(b) - poly32.measureArea(a));
    const projgeoms = projpolys.map((p) => geom22.fromPoints(p.vertices));
    return unionGeom22(projgeoms);
  };
  const project = (options, ...objects) => {
    const defaults = {
      axis: [0, 0, 1],
      // Z axis
      origin: [0, 0, 0]
    };
    const { axis, origin } = Object.assign({}, defaults, options);
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    options = { axis, origin };
    const results = objects.map((object) => {
      if (geom32.isA(object)) return projectGeom3(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  project_1 = project;
  return project_1;
}
var extrusions;
var hasRequiredExtrusions;
function requireExtrusions() {
  if (hasRequiredExtrusions) return extrusions;
  hasRequiredExtrusions = 1;
  extrusions = {
    extrudeFromSlices: requireExtrudeFromSlices(),
    extrudeLinear: requireExtrudeLinear(),
    extrudeRectangular: requireExtrudeRectangular(),
    extrudeRotate: requireExtrudeRotate(),
    extrudeHelical: requireExtrudeHelical(),
    project: requireProject(),
    slice: requireSlice()
  };
  return extrusions;
}
var hullPoints2_1;
var hasRequiredHullPoints2;
function requireHullPoints2() {
  if (hasRequiredHullPoints2) return hullPoints2_1;
  hasRequiredHullPoints2 = 1;
  const vec22 = requireVec2();
  const hullPoints2 = (uniquePoints) => {
    let min = vec22.fromValues(Infinity, Infinity);
    uniquePoints.forEach((point) => {
      if (point[1] < min[1] || point[1] === min[1] && point[0] < min[0]) {
        min = point;
      }
    });
    const points = [];
    uniquePoints.forEach((point) => {
      const angle2 = fakeAtan2(point[1] - min[1], point[0] - min[0]);
      const distSq = vec22.squaredDistance(point, min);
      points.push({ point, angle: angle2, distSq });
    });
    points.sort((pt1, pt2) => pt1.angle !== pt2.angle ? pt1.angle - pt2.angle : pt1.distSq - pt2.distSq);
    const stack = [];
    points.forEach((point) => {
      let cnt = stack.length;
      while (cnt > 1 && ccw2(stack[cnt - 2], stack[cnt - 1], point.point) <= Number.EPSILON) {
        stack.pop();
        cnt = stack.length;
      }
      stack.push(point.point);
    });
    return stack;
  };
  const ccw2 = (v1, v22, v32) => (v22[0] - v1[0]) * (v32[1] - v1[1]) - (v22[1] - v1[1]) * (v32[0] - v1[0]);
  const fakeAtan2 = (y, x) => {
    if (y === 0 && x === 0) {
      return -Infinity;
    } else {
      return -x / y;
    }
  };
  hullPoints2_1 = hullPoints2;
  return hullPoints2_1;
}
var toUniquePoints_1;
var hasRequiredToUniquePoints;
function requireToUniquePoints() {
  if (hasRequiredToUniquePoints) return toUniquePoints_1;
  hasRequiredToUniquePoints = 1;
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const toUniquePoints = (geometries2) => {
    const found = /* @__PURE__ */ new Set();
    const uniquePoints = [];
    const addPoint = (point) => {
      const key = point.toString();
      if (!found.has(key)) {
        uniquePoints.push(point);
        found.add(key);
      }
    };
    geometries2.forEach((geometry) => {
      if (geom22.isA(geometry)) {
        geom22.toPoints(geometry).forEach(addPoint);
      } else if (geom32.isA(geometry)) {
        geom32.toPoints(geometry).forEach((points) => points.forEach(addPoint));
      } else if (path22.isA(geometry)) {
        path22.toPoints(geometry).forEach(addPoint);
      }
    });
    return uniquePoints;
  };
  toUniquePoints_1 = toUniquePoints;
  return toUniquePoints_1;
}
var hullPath2_1;
var hasRequiredHullPath2;
function requireHullPath2() {
  if (hasRequiredHullPath2) return hullPath2_1;
  hasRequiredHullPath2 = 1;
  const flatten = requireFlatten();
  const path22 = requirePath2();
  const hullPoints2 = requireHullPoints2();
  const toUniquePoints = requireToUniquePoints();
  const hullPath2 = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const unique = toUniquePoints(geometries2);
    const hullPoints = hullPoints2(unique);
    return path22.fromPoints({ closed: true }, hullPoints);
  };
  hullPath2_1 = hullPath2;
  return hullPath2_1;
}
var hullGeom2_1;
var hasRequiredHullGeom2;
function requireHullGeom2() {
  if (hasRequiredHullGeom2) return hullGeom2_1;
  hasRequiredHullGeom2 = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const hullPoints2 = requireHullPoints2();
  const toUniquePoints = requireToUniquePoints();
  const hullGeom2 = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const unique = toUniquePoints(geometries2);
    const hullPoints = hullPoints2(unique);
    if (hullPoints.length < 3) return geom22.create();
    return geom22.fromPoints(hullPoints);
  };
  hullGeom2_1 = hullGeom2;
  return hullGeom2_1;
}
var hullGeom3_1;
var hasRequiredHullGeom3;
function requireHullGeom3() {
  if (hasRequiredHullGeom3) return hullGeom3_1;
  hasRequiredHullGeom3 = 1;
  const flatten = requireFlatten();
  const geom32 = requireGeom3();
  const toUniquePoints = requireToUniquePoints();
  const hullPoints3 = requireHullPoints3();
  const hullGeom3 = (...geometries2) => {
    geometries2 = flatten(geometries2);
    const unique = toUniquePoints(geometries2);
    if (unique.length === 0) return geom32.create();
    return geom32.create(hullPoints3(unique));
  };
  hullGeom3_1 = hullGeom3;
  return hullGeom3_1;
}
var hull_1;
var hasRequiredHull;
function requireHull() {
  if (hasRequiredHull) return hull_1;
  hasRequiredHull = 1;
  const flatten = requireFlatten();
  const areAllShapesTheSameType = requireAreAllShapesTheSameType();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const hullPath2 = requireHullPath2();
  const hullGeom2 = requireHullGeom2();
  const hullGeom3 = requireHullGeom3();
  const hull = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    if (!areAllShapesTheSameType(geometries2)) {
      throw new Error("only hulls of the same type are supported");
    }
    const geometry = geometries2[0];
    if (path22.isA(geometry)) return hullPath2(geometries2);
    if (geom22.isA(geometry)) return hullGeom2(geometries2);
    if (geom32.isA(geometry)) return hullGeom3(geometries2);
    return geometry;
  };
  hull_1 = hull;
  return hull_1;
}
var hullChain_1;
var hasRequiredHullChain;
function requireHullChain() {
  if (hasRequiredHullChain) return hullChain_1;
  hasRequiredHullChain = 1;
  const flatten = requireFlatten();
  const union = requireUnion();
  const hull = requireHull();
  const hullChain = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length < 2) throw new Error("wrong number of arguments");
    const hulls2 = [];
    for (let i = 1; i < geometries2.length; i++) {
      hulls2.push(hull(geometries2[i - 1], geometries2[i]));
    }
    return union(hulls2);
  };
  hullChain_1 = hullChain;
  return hullChain_1;
}
var hulls;
var hasRequiredHulls;
function requireHulls() {
  if (hasRequiredHulls) return hulls;
  hasRequiredHulls = 1;
  hulls = {
    hull: requireHull(),
    hullChain: requireHullChain(),
    hullPoints2: requireHullPoints2(),
    hullPoints3: requireHullPoints3()
  };
  return hulls;
}
var minkowski;
var hasRequiredMinkowski;
function requireMinkowski() {
  if (hasRequiredMinkowski) return minkowski;
  hasRequiredMinkowski = 1;
  minkowski = {
    minkowskiSum: requireMinkowskiSum()
  };
  return minkowski;
}
var snapPolygons_1;
var hasRequiredSnapPolygons;
function requireSnapPolygons() {
  if (hasRequiredSnapPolygons) return snapPolygons_1;
  hasRequiredSnapPolygons = 1;
  const vec32 = requireVec3();
  const poly32 = requirePoly3();
  const isValidPoly3 = (epsilon, polygon) => {
    const area = Math.abs(poly32.measureArea(polygon));
    return Number.isFinite(area) && area > epsilon;
  };
  const snapPolygons = (epsilon, polygons) => {
    let newpolygons = polygons.map((polygon) => {
      const snapvertices = polygon.vertices.map((vertice) => vec32.snap(vec32.create(), vertice, epsilon));
      const newvertices = [];
      for (let i = 0; i < snapvertices.length; i++) {
        const j = (i + 1) % snapvertices.length;
        if (!vec32.equals(snapvertices[i], snapvertices[j])) newvertices.push(snapvertices[i]);
      }
      const newpolygon = poly32.create(newvertices);
      if (polygon.color) newpolygon.color = polygon.color;
      return newpolygon;
    });
    const epsilonArea = epsilon * epsilon * Math.sqrt(3) / 4;
    newpolygons = newpolygons.filter((polygon) => isValidPoly3(epsilonArea, polygon));
    return newpolygons;
  };
  snapPolygons_1 = snapPolygons;
  return snapPolygons_1;
}
var mergePolygons_1;
var hasRequiredMergePolygons;
function requireMergePolygons() {
  if (hasRequiredMergePolygons) return mergePolygons_1;
  hasRequiredMergePolygons = 1;
  const aboutEqualNormals = requireAboutEqualNormals();
  const vec32 = requireVec3();
  const poly32 = requirePoly3();
  const createEdges = (polygon) => {
    const points = poly32.toPoints(polygon);
    const edges = [];
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const edge = {
        v1: points[i],
        v2: points[j]
      };
      edges.push(edge);
    }
    for (let i = 0; i < edges.length; i++) {
      const j = (i + 1) % points.length;
      edges[i].next = edges[j];
      edges[j].prev = edges[i];
    }
    return edges;
  };
  const insertEdge = (edges, edge) => {
    const key = `${edge.v1}:${edge.v2}`;
    edges.set(key, edge);
  };
  const deleteEdge = (edges, edge) => {
    const key = `${edge.v1}:${edge.v2}`;
    edges.delete(key);
  };
  const findOppositeEdge = (edges, edge) => {
    const key = `${edge.v2}:${edge.v1}`;
    return edges.get(key);
  };
  const calculateAnglesBetween = (current, opposite, normal) => {
    let v0 = current.prev.v1;
    let v12 = current.prev.v2;
    let v23 = opposite.next.v2;
    const angle1 = calculateAngle(v0, v12, v23, normal);
    v0 = opposite.prev.v1;
    v12 = opposite.prev.v2;
    v23 = current.next.v2;
    const angle2 = calculateAngle(v0, v12, v23, normal);
    return [angle1, angle2];
  };
  const v1 = vec32.create();
  const v22 = vec32.create();
  const calculateAngle = (prevpoint, point, nextpoint, normal) => {
    const d0 = vec32.subtract(v1, point, prevpoint);
    const d1 = vec32.subtract(v22, nextpoint, point);
    vec32.cross(d0, d0, d1);
    return vec32.dot(d0, normal);
  };
  const createPolygonAnd = (edge) => {
    let polygon;
    const points = [];
    while (edge.next) {
      const next = edge.next;
      points.push(edge.v1);
      edge.v1 = null;
      edge.v2 = null;
      edge.next = null;
      edge.prev = null;
      edge = next;
    }
    if (points.length > 0) polygon = poly32.create(points);
    return polygon;
  };
  const mergeCoplanarPolygons = (sourcepolygons) => {
    if (sourcepolygons.length < 2) return sourcepolygons;
    const normal = sourcepolygons[0].plane;
    const polygons = sourcepolygons.slice();
    const edgeList = /* @__PURE__ */ new Map();
    while (polygons.length > 0) {
      const polygon = polygons.shift();
      const edges = createEdges(polygon);
      for (let i = 0; i < edges.length; i++) {
        const current = edges[i];
        const opposite = findOppositeEdge(edgeList, current);
        if (opposite) {
          const angles = calculateAnglesBetween(current, opposite, normal);
          if (angles[0] >= 0 && angles[1] >= 0) {
            const edge1 = opposite.next;
            const edge2 = current.next;
            current.prev.next = opposite.next;
            current.next.prev = opposite.prev;
            opposite.prev.next = current.next;
            opposite.next.prev = current.prev;
            current.v1 = null;
            current.v2 = null;
            current.next = null;
            current.prev = null;
            deleteEdge(edgeList, opposite);
            opposite.v1 = null;
            opposite.v2 = null;
            opposite.next = null;
            opposite.prev = null;
            const mergeEdges = (list, e1, e2) => {
              const newedge = {
                v1: e2.v1,
                v2: e1.v2,
                next: e1.next,
                prev: e2.prev
              };
              e2.prev.next = newedge;
              e1.next.prev = newedge;
              deleteEdge(list, e1);
              e1.v1 = null;
              e1.v2 = null;
              e1.next = null;
              e1.prev = null;
              deleteEdge(list, e2);
              e2.v1 = null;
              e2.v2 = null;
              e2.next = null;
              e2.prev = null;
            };
            if (angles[0] === 0) {
              mergeEdges(edgeList, edge1, edge1.prev);
            }
            if (angles[1] === 0) {
              mergeEdges(edgeList, edge2, edge2.prev);
            }
          }
        } else {
          if (current.next) insertEdge(edgeList, current);
        }
      }
    }
    const destpolygons = [];
    edgeList.forEach((edge) => {
      const polygon = createPolygonAnd(edge);
      if (polygon) destpolygons.push(polygon);
    });
    edgeList.clear();
    return destpolygons;
  };
  const coplanar = (plane1, plane2) => {
    if (Math.abs(plane1[3] - plane2[3]) < 15e-8) {
      return aboutEqualNormals(plane1, plane2);
    }
    return false;
  };
  const mergePolygons = (epsilon, polygons) => {
    const polygonsPerPlane = [];
    polygons.forEach((polygon) => {
      const mapping = polygonsPerPlane.find((element) => coplanar(element[0], poly32.plane(polygon)));
      if (mapping) {
        const polygons2 = mapping[1];
        polygons2.push(polygon);
      } else {
        polygonsPerPlane.push([poly32.plane(polygon), [polygon]]);
      }
    });
    let destpolygons = [];
    polygonsPerPlane.forEach((mapping) => {
      const sourcepolygons = mapping[1];
      const retesselayedpolygons = mergeCoplanarPolygons(sourcepolygons);
      destpolygons = destpolygons.concat(retesselayedpolygons);
    });
    return destpolygons;
  };
  mergePolygons_1 = mergePolygons;
  return mergePolygons_1;
}
var insertTjunctions_1;
var hasRequiredInsertTjunctions;
function requireInsertTjunctions() {
  if (hasRequiredInsertTjunctions) return insertTjunctions_1;
  hasRequiredInsertTjunctions = 1;
  const constants2 = requireConstants();
  const vec32 = requireVec3();
  const poly32 = requirePoly3();
  const getTag = (vertex) => `${vertex}`;
  const addSide = (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) => {
    const starttag = getTag(vertex0);
    const endtag = getTag(vertex1);
    const newsidetag = `${starttag}/${endtag}`;
    const reversesidetag = `${endtag}/${starttag}`;
    if (sidemap.has(reversesidetag)) {
      deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, vertex1, vertex0, null);
      return null;
    }
    const newsideobj = {
      vertex0,
      vertex1,
      polygonindex
    };
    if (!sidemap.has(newsidetag)) {
      sidemap.set(newsidetag, [newsideobj]);
    } else {
      sidemap.get(newsidetag).push(newsideobj);
    }
    if (vertextag2sidestart.has(starttag)) {
      vertextag2sidestart.get(starttag).push(newsidetag);
    } else {
      vertextag2sidestart.set(starttag, [newsidetag]);
    }
    if (vertextag2sideend.has(endtag)) {
      vertextag2sideend.get(endtag).push(newsidetag);
    } else {
      vertextag2sideend.set(endtag, [newsidetag]);
    }
    return newsidetag;
  };
  const deleteSide = (sidemap, vertextag2sidestart, vertextag2sideend, vertex0, vertex1, polygonindex) => {
    const starttag = getTag(vertex0);
    const endtag = getTag(vertex1);
    const sidetag = `${starttag}/${endtag}`;
    let idx = -1;
    const sideobjs = sidemap.get(sidetag);
    for (let i = 0; i < sideobjs.length; i++) {
      const sideobj = sideobjs[i];
      let sidetag2 = getTag(sideobj.vertex0);
      if (sidetag2 !== starttag) continue;
      sidetag2 = getTag(sideobj.vertex1);
      if (sidetag2 !== endtag) continue;
      if (polygonindex !== null) {
        if (sideobj.polygonindex !== polygonindex) continue;
      }
      idx = i;
      break;
    }
    sideobjs.splice(idx, 1);
    if (sideobjs.length === 0) {
      sidemap.delete(sidetag);
    }
    idx = vertextag2sidestart.get(starttag).indexOf(sidetag);
    vertextag2sidestart.get(starttag).splice(idx, 1);
    if (vertextag2sidestart.get(starttag).length === 0) {
      vertextag2sidestart.delete(starttag);
    }
    idx = vertextag2sideend.get(endtag).indexOf(sidetag);
    vertextag2sideend.get(endtag).splice(idx, 1);
    if (vertextag2sideend.get(endtag).length === 0) {
      vertextag2sideend.delete(endtag);
    }
  };
  const insertTjunctions = (polygons) => {
    const sidemap = /* @__PURE__ */ new Map();
    for (let polygonindex = 0; polygonindex < polygons.length; polygonindex++) {
      const polygon = polygons[polygonindex];
      const numvertices = polygon.vertices.length;
      if (numvertices >= 3) {
        let vertex = polygon.vertices[0];
        let vertextag = getTag(vertex);
        for (let vertexindex = 0; vertexindex < numvertices; vertexindex++) {
          let nextvertexindex = vertexindex + 1;
          if (nextvertexindex === numvertices) nextvertexindex = 0;
          const nextvertex = polygon.vertices[nextvertexindex];
          const nextvertextag = getTag(nextvertex);
          const sidetag = `${vertextag}/${nextvertextag}`;
          const reversesidetag = `${nextvertextag}/${vertextag}`;
          if (sidemap.has(reversesidetag)) {
            const ar = sidemap.get(reversesidetag);
            ar.splice(-1, 1);
            if (ar.length === 0) {
              sidemap.delete(reversesidetag);
            }
          } else {
            const sideobj = {
              vertex0: vertex,
              vertex1: nextvertex,
              polygonindex
            };
            if (!sidemap.has(sidetag)) {
              sidemap.set(sidetag, [sideobj]);
            } else {
              sidemap.get(sidetag).push(sideobj);
            }
          }
          vertex = nextvertex;
          vertextag = nextvertextag;
        }
      } else {
        console.warn("warning: invalid polygon found during insertTjunctions");
      }
    }
    if (sidemap.size > 0) {
      const vertextag2sidestart = /* @__PURE__ */ new Map();
      const vertextag2sideend = /* @__PURE__ */ new Map();
      const sidesToCheck = /* @__PURE__ */ new Map();
      for (const [sidetag, sideobjs] of sidemap) {
        sidesToCheck.set(sidetag, true);
        sideobjs.forEach((sideobj) => {
          const starttag = getTag(sideobj.vertex0);
          const endtag = getTag(sideobj.vertex1);
          if (vertextag2sidestart.has(starttag)) {
            vertextag2sidestart.get(starttag).push(sidetag);
          } else {
            vertextag2sidestart.set(starttag, [sidetag]);
          }
          if (vertextag2sideend.has(endtag)) {
            vertextag2sideend.get(endtag).push(sidetag);
          } else {
            vertextag2sideend.set(endtag, [sidetag]);
          }
        });
      }
      const newpolygons = polygons.slice(0);
      while (true) {
        if (sidemap.size === 0) break;
        for (const sidetag of sidemap.keys()) {
          sidesToCheck.set(sidetag, true);
        }
        let donesomething = false;
        while (true) {
          const sidetags = Array.from(sidesToCheck.keys());
          if (sidetags.length === 0) break;
          const sidetagtocheck = sidetags[0];
          let donewithside = true;
          if (sidemap.has(sidetagtocheck)) {
            const sideobjs = sidemap.get(sidetagtocheck);
            const sideobj = sideobjs[0];
            for (let directionindex = 0; directionindex < 2; directionindex++) {
              const startvertex = directionindex === 0 ? sideobj.vertex0 : sideobj.vertex1;
              const endvertex = directionindex === 0 ? sideobj.vertex1 : sideobj.vertex0;
              const startvertextag = getTag(startvertex);
              const endvertextag = getTag(endvertex);
              let matchingsides = [];
              if (directionindex === 0) {
                if (vertextag2sideend.has(startvertextag)) {
                  matchingsides = vertextag2sideend.get(startvertextag);
                }
              } else {
                if (vertextag2sidestart.has(startvertextag)) {
                  matchingsides = vertextag2sidestart.get(startvertextag);
                }
              }
              for (let matchingsideindex = 0; matchingsideindex < matchingsides.length; matchingsideindex++) {
                const matchingsidetag = matchingsides[matchingsideindex];
                const matchingside = sidemap.get(matchingsidetag)[0];
                const matchingsidestartvertex = directionindex === 0 ? matchingside.vertex0 : matchingside.vertex1;
                directionindex === 0 ? matchingside.vertex1 : matchingside.vertex0;
                const matchingsidestartvertextag = getTag(matchingsidestartvertex);
                if (matchingsidestartvertextag === endvertextag) {
                  deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, startvertex, endvertex, null);
                  deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, startvertex, null);
                  donewithside = false;
                  directionindex = 2;
                  donesomething = true;
                  break;
                } else {
                  const startpos = startvertex;
                  const endpos = endvertex;
                  const checkpos = matchingsidestartvertex;
                  const direction = vec32.subtract(vec32.create(), checkpos, startpos);
                  const t = vec32.dot(vec32.subtract(vec32.create(), endpos, startpos), direction) / vec32.dot(direction, direction);
                  if (t > 0 && t < 1) {
                    const closestpoint = vec32.scale(vec32.create(), direction, t);
                    vec32.add(closestpoint, closestpoint, startpos);
                    const distancesquared = vec32.squaredDistance(closestpoint, endpos);
                    if (distancesquared < constants2.EPS * constants2.EPS) {
                      const polygonindex = matchingside.polygonindex;
                      const polygon = newpolygons[polygonindex];
                      const insertionvertextag = getTag(matchingside.vertex1);
                      let insertionvertextagindex = -1;
                      for (let i = 0; i < polygon.vertices.length; i++) {
                        if (getTag(polygon.vertices[i]) === insertionvertextag) {
                          insertionvertextagindex = i;
                          break;
                        }
                      }
                      const newvertices = polygon.vertices.slice(0);
                      newvertices.splice(insertionvertextagindex, 0, endvertex);
                      const newpolygon = poly32.create(newvertices);
                      newpolygons[polygonindex] = newpolygon;
                      deleteSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, matchingside.vertex1, polygonindex);
                      const newsidetag1 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, matchingside.vertex0, endvertex, polygonindex);
                      const newsidetag2 = addSide(sidemap, vertextag2sidestart, vertextag2sideend, endvertex, matchingside.vertex1, polygonindex);
                      if (newsidetag1 !== null) sidesToCheck.set(newsidetag1, true);
                      if (newsidetag2 !== null) sidesToCheck.set(newsidetag2, true);
                      donewithside = false;
                      directionindex = 2;
                      donesomething = true;
                      break;
                    }
                  }
                }
              }
            }
          }
          if (donewithside) {
            sidesToCheck.delete(sidetagtocheck);
          }
        }
        if (!donesomething) break;
      }
      polygons = newpolygons;
    }
    sidemap.clear();
    return polygons;
  };
  insertTjunctions_1 = insertTjunctions;
  return insertTjunctions_1;
}
var triangulatePolygons_1;
var hasRequiredTriangulatePolygons;
function requireTriangulatePolygons() {
  if (hasRequiredTriangulatePolygons) return triangulatePolygons_1;
  hasRequiredTriangulatePolygons = 1;
  const vec32 = requireVec3();
  const poly32 = requirePoly3();
  const triangulatePolygon = (epsilon, polygon, triangles) => {
    const nv = polygon.vertices.length;
    if (nv > 3) {
      if (nv > 4) {
        const midpoint = [0, 0, 0];
        polygon.vertices.forEach((vertice) => vec32.add(midpoint, midpoint, vertice));
        vec32.snap(midpoint, vec32.divide(midpoint, midpoint, [nv, nv, nv]), epsilon);
        for (let i = 0; i < nv; i++) {
          const poly = poly32.create([midpoint, polygon.vertices[i], polygon.vertices[(i + 1) % nv]]);
          if (polygon.color) poly.color = polygon.color;
          triangles.push(poly);
        }
        return;
      }
      const poly0 = poly32.create([polygon.vertices[0], polygon.vertices[1], polygon.vertices[2]]);
      const poly1 = poly32.create([polygon.vertices[0], polygon.vertices[2], polygon.vertices[3]]);
      if (polygon.color) {
        poly0.color = polygon.color;
        poly1.color = polygon.color;
      }
      triangles.push(poly0, poly1);
      return;
    }
    triangles.push(polygon);
  };
  const triangulatePolygons = (epsilon, polygons) => {
    const triangles = [];
    polygons.forEach((polygon) => {
      triangulatePolygon(epsilon, polygon, triangles);
    });
    return triangles;
  };
  triangulatePolygons_1 = triangulatePolygons;
  return triangulatePolygons_1;
}
var generalize_1;
var hasRequiredGeneralize;
function requireGeneralize() {
  if (hasRequiredGeneralize) return generalize_1;
  hasRequiredGeneralize = 1;
  const flatten = requireFlatten();
  const measureEpsilon = requireMeasureEpsilon();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const snapPolygons = requireSnapPolygons();
  const mergePolygons = requireMergePolygons();
  const insertTjunctions = requireInsertTjunctions();
  const triangulatePolygons = requireTriangulatePolygons();
  const generalizePath2 = (options, geometry) => geometry;
  const generalizeGeom2 = (options, geometry) => geometry;
  const generalizeGeom3 = (options, geometry) => {
    const defaults = {
      snap: false,
      simplify: false,
      triangulate: false
    };
    const { snap, simplify, triangulate } = Object.assign({}, defaults, options);
    const epsilon = measureEpsilon(geometry);
    let polygons = geom32.toPolygons(geometry);
    if (snap) {
      polygons = snapPolygons(epsilon, polygons);
    }
    if (simplify) {
      polygons = mergePolygons(epsilon, polygons);
    }
    if (triangulate) {
      polygons = insertTjunctions(polygons);
      polygons = triangulatePolygons(epsilon, polygons);
    }
    const clone = Object.assign({}, geometry);
    clone.polygons = polygons;
    return clone;
  };
  const generalize = (options, ...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path22.isA(geometry)) return generalizePath2(options, geometry);
      if (geom22.isA(geometry)) return generalizeGeom2(options, geometry);
      if (geom32.isA(geometry)) return generalizeGeom3(options, geometry);
      throw new Error("invalid geometry");
    });
    return results.length === 1 ? results[0] : results;
  };
  generalize_1 = generalize;
  return generalize_1;
}
var snap_1;
var hasRequiredSnap;
function requireSnap() {
  if (hasRequiredSnap) return snap_1;
  hasRequiredSnap = 1;
  const flatten = requireFlatten();
  const vec22 = requireVec2();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const measureEpsilon = requireMeasureEpsilon();
  const snapPolygons = requireSnapPolygons();
  const snapPath2 = (geometry) => {
    const epsilon = measureEpsilon(geometry);
    const points = path22.toPoints(geometry);
    const newpoints = points.map((point) => vec22.snap(vec22.create(), point, epsilon));
    return path22.create(newpoints);
  };
  const snapGeom2 = (geometry) => {
    const epsilon = measureEpsilon(geometry);
    const sides = geom22.toSides(geometry);
    let newsides = sides.map((side) => [vec22.snap(vec22.create(), side[0], epsilon), vec22.snap(vec22.create(), side[1], epsilon)]);
    newsides = newsides.filter((side) => !vec22.equals(side[0], side[1]));
    return geom22.create(newsides);
  };
  const snapGeom3 = (geometry) => {
    const epsilon = measureEpsilon(geometry);
    const polygons = geom32.toPolygons(geometry);
    const newpolygons = snapPolygons(epsilon, polygons);
    return geom32.create(newpolygons);
  };
  const snap = (...geometries2) => {
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("wrong number of arguments");
    const results = geometries2.map((geometry) => {
      if (path22.isA(geometry)) return snapPath2(geometry);
      if (geom22.isA(geometry)) return snapGeom2(geometry);
      if (geom32.isA(geometry)) return snapGeom3(geometry);
      return geometry;
    });
    return results.length === 1 ? results[0] : results;
  };
  snap_1 = snap;
  return snap_1;
}
var modifiers;
var hasRequiredModifiers;
function requireModifiers() {
  if (hasRequiredModifiers) return modifiers;
  hasRequiredModifiers = 1;
  modifiers = {
    generalize: requireGeneralize(),
    snap: requireSnap(),
    retessellate: requireRetessellate()
  };
  return modifiers;
}
var padArrayToLength_1;
var hasRequiredPadArrayToLength;
function requirePadArrayToLength() {
  if (hasRequiredPadArrayToLength) return padArrayToLength_1;
  hasRequiredPadArrayToLength = 1;
  const padArrayToLength = (anArray, padding, targetLength) => {
    anArray = anArray.slice();
    while (anArray.length < targetLength) {
      anArray.push(padding);
    }
    return anArray;
  };
  padArrayToLength_1 = padArrayToLength;
  return padArrayToLength_1;
}
var align_1;
var hasRequiredAlign;
function requireAlign() {
  if (hasRequiredAlign) return align_1;
  hasRequiredAlign = 1;
  const flatten = requireFlatten();
  const padArrayToLength = requirePadArrayToLength();
  const measureAggregateBoundingBox = requireMeasureAggregateBoundingBox();
  const { translate } = requireTranslate();
  const validateOptions = (options) => {
    if (!Array.isArray(options.modes) || options.modes.length > 3) throw new Error("align(): modes must be an array of length <= 3");
    options.modes = padArrayToLength(options.modes, "none", 3);
    if (options.modes.filter((mode) => ["center", "max", "min", "none"].includes(mode)).length !== 3) throw new Error('align(): all modes must be one of "center", "max" or "min"');
    if (!Array.isArray(options.relativeTo) || options.relativeTo.length > 3) throw new Error("align(): relativeTo must be an array of length <= 3");
    options.relativeTo = padArrayToLength(options.relativeTo, 0, 3);
    if (options.relativeTo.filter((alignVal) => Number.isFinite(alignVal) || alignVal == null).length !== 3) throw new Error("align(): all relativeTo values must be a number, or null.");
    if (typeof options.grouped !== "boolean") throw new Error("align(): grouped must be a boolean value.");
    return options;
  };
  const populateRelativeToFromBounds = (relativeTo, modes, bounds2) => {
    for (let i = 0; i < 3; i++) {
      if (relativeTo[i] == null) {
        if (modes[i] === "center") {
          relativeTo[i] = (bounds2[0][i] + bounds2[1][i]) / 2;
        } else if (modes[i] === "max") {
          relativeTo[i] = bounds2[1][i];
        } else if (modes[i] === "min") {
          relativeTo[i] = bounds2[0][i];
        }
      }
    }
    return relativeTo;
  };
  const alignGeometries = (geometry, modes, relativeTo) => {
    const bounds2 = measureAggregateBoundingBox(geometry);
    const translation = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      if (modes[i] === "center") {
        translation[i] = relativeTo[i] - (bounds2[0][i] + bounds2[1][i]) / 2;
      } else if (modes[i] === "max") {
        translation[i] = relativeTo[i] - bounds2[1][i];
      } else if (modes[i] === "min") {
        translation[i] = relativeTo[i] - bounds2[0][i];
      }
    }
    return translate(translation, geometry);
  };
  const align = (options, ...geometries2) => {
    const defaults = {
      modes: ["center", "center", "min"],
      relativeTo: [0, 0, 0],
      grouped: false
    };
    options = Object.assign({}, defaults, options);
    options = validateOptions(options);
    let { modes, relativeTo, grouped } = options;
    geometries2 = flatten(geometries2);
    if (geometries2.length === 0) throw new Error("align(): No geometries were provided to act upon");
    if (relativeTo.filter((val) => val == null).length) {
      const bounds2 = measureAggregateBoundingBox(geometries2);
      relativeTo = populateRelativeToFromBounds(relativeTo, modes, bounds2);
    }
    if (grouped) {
      geometries2 = alignGeometries(geometries2, modes, relativeTo);
    } else {
      geometries2 = geometries2.map((geometry) => alignGeometries(geometry, modes, relativeTo));
    }
    return geometries2.length === 1 ? geometries2[0] : geometries2;
  };
  align_1 = align;
  return align_1;
}
var center_1;
var hasRequiredCenter;
function requireCenter() {
  if (hasRequiredCenter) return center_1;
  hasRequiredCenter = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const measureBoundingBox = requireMeasureBoundingBox();
  const { translate } = requireTranslate();
  const centerGeometry = (options, object) => {
    const defaults = {
      axes: [true, true, true],
      relativeTo: [0, 0, 0]
    };
    const { axes, relativeTo } = Object.assign({}, defaults, options);
    const bounds2 = measureBoundingBox(object);
    const offset = [0, 0, 0];
    if (axes[0]) offset[0] = relativeTo[0] - (bounds2[0][0] + (bounds2[1][0] - bounds2[0][0]) / 2);
    if (axes[1]) offset[1] = relativeTo[1] - (bounds2[0][1] + (bounds2[1][1] - bounds2[0][1]) / 2);
    if (axes[2]) offset[2] = relativeTo[2] - (bounds2[0][2] + (bounds2[1][2] - bounds2[0][2]) / 2);
    return translate(offset, object);
  };
  const center = (options, ...objects) => {
    const defaults = {
      axes: [true, true, true],
      relativeTo: [0, 0, 0]
      // TODO: Add additional 'methods' of centering: midpoint, centroid
    };
    const { axes, relativeTo } = Object.assign({}, defaults, options);
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    if (relativeTo.length !== 3) throw new Error("relativeTo must be an array of length 3");
    options = { axes, relativeTo };
    const results = objects.map((object) => {
      if (path22.isA(object)) return centerGeometry(options, object);
      if (geom22.isA(object)) return centerGeometry(options, object);
      if (geom32.isA(object)) return centerGeometry(options, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const centerX = (...objects) => center({ axes: [true, false, false] }, objects);
  const centerY = (...objects) => center({ axes: [false, true, false] }, objects);
  const centerZ = (...objects) => center({ axes: [false, false, true] }, objects);
  center_1 = {
    center,
    centerX,
    centerY,
    centerZ
  };
  return center_1;
}
var scale_1;
var hasRequiredScale;
function requireScale() {
  if (hasRequiredScale) return scale_1;
  hasRequiredScale = 1;
  const flatten = requireFlatten();
  const mat42 = requireMat4();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const scale = (factors, ...objects) => {
    if (!Array.isArray(factors)) throw new Error("factors must be an array");
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    factors = factors.slice();
    while (factors.length < 3) factors.push(1);
    if (factors[0] <= 0 || factors[1] <= 0 || factors[2] <= 0) throw new Error("factors must be positive");
    const matrix = mat42.fromScaling(mat42.create(), factors);
    const results = objects.map((object) => {
      if (path22.isA(object)) return path22.transform(matrix, object);
      if (geom22.isA(object)) return geom22.transform(matrix, object);
      if (geom32.isA(object)) return geom32.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  const scaleX = (factor, ...objects) => scale([factor, 1, 1], objects);
  const scaleY = (factor, ...objects) => scale([1, factor, 1], objects);
  const scaleZ = (factor, ...objects) => scale([1, 1, factor], objects);
  scale_1 = {
    scale,
    scaleX,
    scaleY,
    scaleZ
  };
  return scale_1;
}
var transform_1;
var hasRequiredTransform;
function requireTransform() {
  if (hasRequiredTransform) return transform_1;
  hasRequiredTransform = 1;
  const flatten = requireFlatten();
  const geom22 = requireGeom2();
  const geom32 = requireGeom3();
  const path22 = requirePath2();
  const transform = (matrix, ...objects) => {
    objects = flatten(objects);
    if (objects.length === 0) throw new Error("wrong number of arguments");
    const results = objects.map((object) => {
      if (path22.isA(object)) return path22.transform(matrix, object);
      if (geom22.isA(object)) return geom22.transform(matrix, object);
      if (geom32.isA(object)) return geom32.transform(matrix, object);
      return object;
    });
    return results.length === 1 ? results[0] : results;
  };
  transform_1 = transform;
  return transform_1;
}
var transforms;
var hasRequiredTransforms;
function requireTransforms() {
  if (hasRequiredTransforms) return transforms;
  hasRequiredTransforms = 1;
  transforms = {
    align: requireAlign(),
    center: requireCenter().center,
    centerX: requireCenter().centerX,
    centerY: requireCenter().centerY,
    centerZ: requireCenter().centerZ,
    mirror: requireMirror().mirror,
    mirrorX: requireMirror().mirrorX,
    mirrorY: requireMirror().mirrorY,
    mirrorZ: requireMirror().mirrorZ,
    rotate: requireRotate().rotate,
    rotateX: requireRotate().rotateX,
    rotateY: requireRotate().rotateY,
    rotateZ: requireRotate().rotateZ,
    scale: requireScale().scale,
    scaleX: requireScale().scaleX,
    scaleY: requireScale().scaleY,
    scaleZ: requireScale().scaleZ,
    transform: requireTransform(),
    translate: requireTranslate().translate,
    translateX: requireTranslate().translateX,
    translateY: requireTranslate().translateY,
    translateZ: requireTranslate().translateZ
  };
  return transforms;
}
var src;
var hasRequiredSrc;
function requireSrc() {
  if (hasRequiredSrc) return src;
  hasRequiredSrc = 1;
  src = {
    colors: requireColors(),
    curves: requireCurves(),
    geometries: requireGeometries(),
    maths: requireMaths(),
    measurements: requireMeasurements(),
    primitives: requirePrimitives(),
    text: requireText(),
    utils: requireUtils(),
    booleans: requireBooleans(),
    expansions: requireExpansions(),
    extrusions: requireExtrusions(),
    hulls: requireHulls(),
    minkowski: requireMinkowski(),
    modifiers: requireModifiers(),
    transforms: requireTransforms()
  };
  return src;
}
var srcExports = requireSrc();
var jscad = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null
}, [srcExports]);
const D2R = Math.PI / 180;
const FUNCS = {
  min: (...a) => Math.min(...a),
  max: (...a) => Math.max(...a),
  abs: Math.abs,
  sqrt: Math.sqrt,
  pow: Math.pow,
  floor: Math.floor,
  ceil: Math.ceil,
  round: Math.round,
  sign: Math.sign,
  sin: (d) => Math.sin(d * D2R),
  cos: (d) => Math.cos(d * D2R),
  tan: (d) => Math.tan(d * D2R),
  asin: (x) => Math.asin(x) / D2R,
  acos: (x) => Math.acos(x) / D2R,
  atan: (x) => Math.atan(x) / D2R,
  atan2: (y, x) => Math.atan2(y, x) / D2R
};
class ExprError extends Error {
}
const TOKEN = /\s*(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?|[A-Za-z_][A-Za-z0-9_]*|&&|\|\||==|!=|<=|>=|[-+*/%()<>!?:,])/y;
function tokenize(src2) {
  const out = [];
  TOKEN.lastIndex = 0;
  let pos = 0;
  while (pos < src2.length) {
    if (/^\s*$/.test(src2.slice(pos))) break;
    TOKEN.lastIndex = pos;
    const m = TOKEN.exec(src2);
    if (!m) throw new ExprError(`Ungültiges Zeichen in Ausdruck "${src2}" an Position ${pos}`);
    out.push(m[1]);
    pos = TOKEN.lastIndex;
  }
  return out;
}
const BIN_PREC = {
  "||": 2,
  "&&": 3,
  "==": 4,
  "!=": 4,
  "<": 5,
  ">": 5,
  "<=": 5,
  ">=": 5,
  "+": 6,
  "-": 6,
  "*": 7,
  "/": 7,
  "%": 7
};
class Parser {
  constructor(t, src2) {
    this.t = t;
    this.src = src2;
  }
  t;
  src;
  i = 0;
  peek() {
    return this.t[this.i];
  }
  next() {
    return this.t[this.i++];
  }
  expect(s) {
    const n = this.next();
    if (n !== s) throw new ExprError(`"${s}" erwartet in "${this.src}"`);
  }
  parse() {
    const e = this.expr(0);
    if (this.i < this.t.length) throw new ExprError(`Unerwartetes "${this.peek()}" in "${this.src}"`);
    return e;
  }
  expr(minPrec) {
    let left = this.unary();
    for (; ; ) {
      const op = this.peek();
      if (op === "?" && minPrec <= 1) {
        this.next();
        const a = this.expr(0);
        this.expect(":");
        const b = this.expr(1);
        left = { k: "tern", c: left, a, b };
        continue;
      }
      const p = op !== void 0 ? BIN_PREC[op] : void 0;
      if (p === void 0 || p < minPrec) break;
      this.next();
      const right = this.expr(p + 1);
      left = { k: "bin", op, a: left, b: right };
    }
    return left;
  }
  unary() {
    const t = this.peek();
    if (t === "-" || t === "+" || t === "!") {
      this.next();
      return { k: "un", op: t, a: this.unary() };
    }
    return this.primary();
  }
  primary() {
    const t = this.next();
    if (t === void 0) throw new ExprError(`Ausdruck unvollständig: "${this.src}"`);
    if (t === "(") {
      const e = this.expr(0);
      this.expect(")");
      return e;
    }
    if (/^[\d.]/.test(t)) return { k: "num", v: parseFloat(t) };
    if (/^[A-Za-z_]/.test(t)) {
      if (t === "true") return { k: "bool", v: true };
      if (t === "false") return { k: "bool", v: false };
      if (this.peek() === "(") {
        this.next();
        if (!FUNCS[t]) throw new ExprError(`Unbekannte Funktion "${t}"`);
        const args = [];
        if (this.peek() !== ")") {
          for (; ; ) {
            args.push(this.expr(0));
            if (this.peek() === ",") {
              this.next();
              continue;
            }
            break;
          }
        }
        this.expect(")");
        return { k: "call", f: t, args };
      }
      return { k: "id", n: t };
    }
    throw new ExprError(`Unerwartetes "${t}" in "${this.src}"`);
  }
}
const cache = /* @__PURE__ */ new Map();
function parseExpr(src2) {
  let a = cache.get(src2);
  if (!a) {
    a = new Parser(tokenize(src2), src2).parse();
    if (cache.size > 5e3) cache.clear();
    cache.set(src2, a);
  }
  return a;
}
function evalAst(a, s) {
  switch (a.k) {
    case "num":
      return a.v;
    case "bool":
      return a.v;
    case "id": {
      if (a.n === "PI") return Math.PI;
      const v = s[a.n];
      if (v === void 0) throw new ExprError(`Unbekannte Variable "${a.n}"`);
      return v;
    }
    case "un": {
      const v = evalAst(a.a, s);
      if (a.op === "!") return !v;
      return a.op === "-" ? -Number(v) : Number(v);
    }
    case "tern":
      return evalAst(a.c, s) ? evalAst(a.a, s) : evalAst(a.b, s);
    case "call":
      return FUNCS[a.f](...a.args.map((x) => Number(evalAst(x, s))));
    case "bin": {
      if (a.op === "&&") return Boolean(evalAst(a.a, s)) && Boolean(evalAst(a.b, s));
      if (a.op === "||") return Boolean(evalAst(a.a, s)) || Boolean(evalAst(a.b, s));
      const x = evalAst(a.a, s);
      const y = evalAst(a.b, s);
      switch (a.op) {
        case "==":
          return x === y;
        case "!=":
          return x !== y;
      }
      const nx = Number(x), ny = Number(y);
      switch (a.op) {
        case "+":
          return nx + ny;
        case "-":
          return nx - ny;
        case "*":
          return nx * ny;
        case "/":
          return nx / ny;
        case "%":
          return nx % ny;
        case "<":
          return nx < ny;
        case ">":
          return nx > ny;
        case "<=":
          return nx <= ny;
        case ">=":
          return nx >= ny;
      }
    }
  }
  throw new ExprError("Interner Ausdrucksfehler");
}
function evalExpr(e, s) {
  if (typeof e === "number" || typeof e === "boolean") return e;
  if (typeof e !== "string") throw new ExprError(`Ungültiger Wert: ${JSON.stringify(e)}`);
  return evalAst(parseExpr(e), s);
}
function num(e, s, what = "Wert") {
  if (e === void 0) throw new ExprError(`${what} fehlt`);
  const v = evalExpr(e, s);
  const n = typeof v === "boolean" ? v ? 1 : 0 : Number(v);
  if (!Number.isFinite(n)) throw new ExprError(`${what} ergibt keine gültige Zahl (${String(e)})`);
  return n;
}
function bool(e, s) {
  return Boolean(evalExpr(e, s));
}
const UMLAUT = { ä: "ae", ö: "oe", ü: "ue", Ä: "Ae", Ö: "Oe", Ü: "Ue", ß: "ss", "€": "EUR", Ø: "O", ø: "o" };
function normalizeText(t) {
  return t.replace(/[äöüÄÖÜß€Øø]/g, (c) => UMLAUT[c]).replace(/[^\x20-\x7e]/g, "?").slice(0, 60);
}
function fillText(t, scope) {
  return t.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_, k) => scope[k] !== void 0 ? String(scope[k]) : `{${k}}`);
}
const { primitives: P$1, booleans: B$1, transforms: T$1, geometries: G$1 } = jscad;
const polysOf$1 = (g) => G$1.geom3.toPolygons(g).map((p) => p.vertices);
function sliceSegments(polys, axis, value) {
  const u = (axis + 1) % 3, v = (axis + 2) % 3;
  const segs2 = [];
  for (const poly of polys) {
    const pts = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      let da = a[axis] - value, db2 = b[axis] - value;
      if (da === 0) da = 1e-9;
      if (db2 === 0) db2 = 1e-9;
      if (da > 0 !== db2 > 0) {
        const t = da / (da - db2);
        pts.push([a[u] + (b[u] - a[u]) * t, a[v] + (b[v] - a[v]) * t]);
      }
    }
    if (pts.length >= 2) segs2.push([pts[0][0], pts[0][1], pts[1][0], pts[1][1]]);
  }
  return segs2;
}
function inside(segs2, x, y) {
  let c = false;
  for (const [x1, y1, x2, y2] of segs2) {
    if (y1 > y !== y2 > y) {
      const xi = x1 + (y - y1) * (x2 - x1) / (y2 - y1);
      if (xi > x) c = !c;
    }
  }
  return c;
}
function distToSegs(segs2, x, y) {
  let best = Infinity;
  for (const [x1, y1, x2, y2] of segs2) {
    const dx = x2 - x1, dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    let t = l2 > 0 ? ((x - x1) * dx + (y - y1) * dy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    const ex = x1 + t * dx - x, ey = y1 + t * dy - y;
    best = Math.min(best, ex * ex + ey * ey);
  }
  return Math.sqrt(best);
}
function axisCylinder(axis, s0, s1, cu, cv, r, chamfer = 0) {
  const h = s1 - s0;
  const seg = Math.min(160, Math.max(32, Math.ceil(2 * Math.PI * r / 0.5 / 16) * 16));
  let g;
  if (chamfer > 0 && h > chamfer * 2) {
    const body = P$1.cylinder({ radius: r, height: h - chamfer, segments: seg, center: [0, 0, (h - chamfer) / 2] });
    const tip = P$1.cylinder({ radius: Math.max(r - chamfer, 0.3), height: h, segments: seg, center: [0, 0, h / 2] });
    g = srcExports.hulls.hull(body, tip);
  } else g = P$1.cylinder({ radius: r, height: h, segments: seg, center: [0, 0, h / 2] });
  if (axis === 0) g = T$1.rotateY(Math.PI / 2, g);
  else if (axis === 1) g = T$1.rotateX(-Math.PI / 2, g);
  const pos = [0, 0, 0];
  pos[axis] = s0;
  pos[(axis + 1) % 3] = cu;
  pos[(axis + 2) % 3] = cv;
  return T$1.translate(pos, g);
}
function splitParts(partsIn, bb, o, bed, tol) {
  let parts = partsIn;
  const size = [0, 1, 2].map((i) => bb.max[i] - bb.min[i]);
  const usable = [bed.size - 3, bed.size - 3, bed.height - 2];
  const cut = o.cutAt;
  const counts = [0, 1, 2].map((i) => {
    if (cut) return i === cut.axis ? 2 : 1;
    const manual = Math.round(o.cuts[i]);
    if (manual > 0) return Math.min(12, manual);
    return Math.max(1, Math.ceil(size[i] / usable[i]));
  });
  const warnings = [];
  const planes = cut ? [0, 1, 2].map((i) => i === cut.axis ? [bb.min[i] + Math.min(0.97, Math.max(0.03, cut.frac)) * size[i]] : []) : [0, 1, 2].map((i) => Array.from({ length: counts[i] - 1 }, (_, k) => bb.min[i] + (k + 1) * size[i] / counts[i]));
  const BIG = 1e4;
  const bounds2 = (i, k) => [k === 0 ? -BIG : planes[i][k - 1], k === counts[i] - 1 ? BIG : planes[i][k]];
  const r = o.pinD / 2;
  const clearance = r + tol + o.minWall;
  let bosses = 0;
  const bossAt = [];
  if (o.joint !== "kleben" && counts.some((c) => c > 1)) {
    const allPolys0 = polysOf$1(parts.length === 1 ? parts[0].geom : B$1.union(...parts.map((p) => p.geom)));
    const add = [];
    for (let axis = 0; axis < 3; axis++) {
      const u = (axis + 1) % 3, v = (axis + 2) % 3;
      for (const pv of planes[axis]) {
        const L = o.depth + 1.5;
        const secs = [sliceSegments(allPolys0, axis, pv), sliceSegments(allPolys0, axis, pv - L + 0.3), sliceSegments(allPolys0, axis, pv + L - 0.3)];
        if (!secs[0].length) continue;
        for (let cu = 0; cu < counts[u]; cu++)
          for (let cv = 0; cv < counts[v]; cv++) {
            const [u0, u1] = bounds2(u, cu), [v0, v1] = bounds2(v, cv);
            const lo = [Math.max(u0, bb.min[u]), Math.max(v0, bb.min[v])];
            const hi = [Math.min(u1, bb.max[u]), Math.min(v1, bb.max[v])];
            const n = 28;
            let ok = false;
            for (let a = 0; a <= n && !ok; a++)
              for (let b = 0; b <= n && !ok; b++) {
                const x = lo[0] + (hi[0] - lo[0]) * a / n, y = lo[1] + (hi[1] - lo[1]) * b / n;
                if (x - lo[0] < clearance || hi[0] - x < clearance || y - lo[1] < clearance || hi[1] - y < clearance) continue;
                if (secs.every((sg) => inside(sg, x, y)) && Math.min(...secs.map((sg) => distToSegs(sg, x, y))) >= clearance) ok = true;
              }
            if (ok) continue;
            const h = clearance + 0.6;
            const cand = [];
            const ratio = (sg, x, y) => {
              let adj = 0, tot = 0, inn = 0, itot = 0;
              for (let i = 0; i < 12; i++) {
                const t = -h + (i + 0.5) * 2 * h / 12, e = h + 0.4;
                for (const [px, py] of [
                  [x + t, y - e],
                  [x + t, y + e],
                  [x - e, y + t],
                  [x + e, y + t]
                ]) {
                  tot++;
                  if (inside(sg, px, py)) adj++;
                }
              }
              for (let i = 0; i < 5; i++)
                for (let j = 0; j < 5; j++) {
                  itot++;
                  if (inside(sg, x - h + (i + 0.5) * 2 * h / 5, y - h + (j + 0.5) * 2 * h / 5)) inn++;
                }
              return { adj: adj / tot, inn: inn / itot };
            };
            const seen = /* @__PURE__ */ new Set();
            const off = h - 0.3;
            for (const sgm of secs[0])
              for (const [px, py] of [
                [sgm[0], sgm[1]],
                [sgm[2], sgm[3]]
              ])
                for (const [dx, dy] of [
                  [1, 1],
                  [1, -1],
                  [-1, 1],
                  [-1, -1]
                ]) {
                  const x = px + dx * off, y = py + dy * off;
                  if (x - h < lo[0] - 1e-6 || x + h > hi[0] + 1e-6 || y - h < lo[1] - 1e-6 || y + h > hi[1] + 1e-6) continue;
                  const key = `${Math.round(x * 10)},${Math.round(y * 10)}`;
                  if (seen.has(key)) continue;
                  seen.add(key);
                  const rs = secs.map((sg) => ratio(sg, x, y));
                  if (rs.every((q) => q.adj >= 0.4 && q.inn <= 0.55)) cand.push({ x, y, s: rs[0].adj - rs[0].inn * 0.2 });
                }
            if (!cand.length) continue;
            const span = Math.max(hi[0] - lo[0], hi[1] - lo[1]);
            const want = o.perFace > 0 ? o.perFace : Math.max(2, Math.min(6, Math.round(span / 70)));
            cand.sort((p, q) => q.s - p.s);
            const chosen = [cand[0]];
            while (chosen.length < want) {
              let best = null, bd = -1;
              for (const p of cand) {
                const dmin = Math.min(...chosen.map((q) => Math.hypot(p.x - q.x, p.y - q.y)));
                if (dmin > bd || Math.abs(dmin - bd) < 1e-6 && best && p.s > best.s) {
                  bd = dmin;
                  best = p;
                }
              }
              if (!best || bd < 4 * h) break;
              chosen.push(best);
            }
            for (const p of chosen) {
              const size2 = [0, 0, 0], c = [0, 0, 0];
              size2[axis] = 2 * L;
              size2[u] = 2 * h;
              size2[v] = 2 * h;
              c[axis] = pv;
              c[u] = p.x;
              c[v] = p.y;
              add.push(P$1.cuboid({ size: size2, center: c }));
              bossAt.push({ axis, pv, x: p.x, y: p.y });
              bosses++;
            }
          }
      }
    }
    if (add.length) {
      parts = parts.map((p, i) => i === 0 ? { ...p, geom: B$1.union(p.geom, ...add) } : p);
      warnings.push(`${bosses} Verbindungsblöcke in Innenecken ergänzt – die Wände sind zu dünn für Zapfen/Dübel.`);
    }
  }
  const cells = [];
  const cellIndex = /* @__PURE__ */ new Map();
  for (let ix = 0; ix < counts[0]; ix++)
    for (let iy = 0; iy < counts[1]; iy++)
      for (let iz = 0; iz < counts[2]; iz++) {
        const [x0, x1] = bounds2(0, ix), [y0, y1] = bounds2(1, iy), [z0, z1] = bounds2(2, iz);
        const box = P$1.cuboid({ size: [x1 - x0, y1 - y0, z1 - z0], center: [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2] });
        const ps = parts.map((p) => ({ ...p, geom: B$1.intersect(p.geom, box) })).filter((p) => polysOf$1(p.geom).length > 0);
        if (!ps.length) continue;
        cellIndex.set(`${ix},${iy},${iz}`, cells.length);
        cells.push({ label: "", cell: [ix, iy, iz], parts: ps, kind: "segment" });
      }
  const pins = [];
  let faces = 0, joints = 0;
  if (o.joint !== "kleben" && cells.length > 1) {
    const allPolys = polysOf$1(parts.length === 1 ? parts[0].geom : B$1.union(...parts.map((p) => p.geom)));
    for (let axis = 0; axis < 3; axis++) {
      planes[axis].forEach((pv, k) => {
        const s0 = sliceSegments(allPolys, axis, pv);
        const sA = sliceSegments(allPolys, axis, pv - o.depth - 0.6);
        const sB = sliceSegments(allPolys, axis, pv + o.depth + 0.6);
        if (!s0.length) return;
        for (const [key, ia] of cellIndex) {
          const c = key.split(",").map(Number);
          if (c[axis] !== k) continue;
          const nb = [...c];
          nb[axis] = k + 1;
          const ib = cellIndex.get(nb.join(","));
          if (ib === void 0) continue;
          faces++;
          const u = (axis + 1) % 3, v = (axis + 2) % 3;
          const [u0, u1] = bounds2(u, c[u]), [v0, v1] = bounds2(v, c[v]);
          const lo = [Math.max(u0, bb.min[u]), Math.max(v0, bb.min[v])];
          const hi = [Math.min(u1, bb.max[u]), Math.min(v1, bb.max[v])];
          const n = 28;
          const cand = [];
          let areaHits = 0;
          for (let a = 0; a <= n; a++)
            for (let b = 0; b <= n; b++) {
              const x = lo[0] + (hi[0] - lo[0]) * a / n, y = lo[1] + (hi[1] - lo[1]) * b / n;
              if (!inside(s0, x, y)) continue;
              areaHits++;
              if (x - lo[0] < clearance || hi[0] - x < clearance || y - lo[1] < clearance || hi[1] - y < clearance) continue;
              if (!inside(sA, x, y) || !inside(sB, x, y)) continue;
              const d = Math.min(distToSegs(s0, x, y), distToSegs(sA, x, y), distToSegs(sB, x, y));
              if (d >= clearance) cand.push({ x, y, d });
            }
          for (const bz of bossAt) {
            if (bz.axis !== axis || Math.abs(bz.pv - pv) > 1e-6 || bz.x < lo[0] || bz.x > hi[0] || bz.y < lo[1] || bz.y > hi[1]) continue;
            if (!inside(s0, bz.x, bz.y) || !inside(sA, bz.x, bz.y) || !inside(sB, bz.x, bz.y)) continue;
            const d = Math.min(distToSegs(s0, bz.x, bz.y), distToSegs(sA, bz.x, bz.y), distToSegs(sB, bz.x, bz.y));
            if (d >= clearance - 0.05) cand.push({ x: bz.x, y: bz.y, d: d + 100 });
          }
          const area = areaHits / ((n + 1) * (n + 1)) * (hi[0] - lo[0]) * (hi[1] - lo[1]);
          const nBoss = cand.filter((c2) => c2.d >= 100).length;
          const want = Math.max(nBoss, o.perFace > 0 ? o.perFace : area < 300 ? 1 : area < 2500 ? 2 : area < 8e3 ? 3 : 4);
          if (!cand.length) {
            warnings.push(`Schnitt ${"XYZ"[axis]} = ${pv.toFixed(1)} mm: zu wenig Material für Ø ${o.pinD} mm – bitte kleben oder kleineren Durchmesser wählen.`);
            continue;
          }
          const chosen = [];
          cand.sort((p, q) => q.d - p.d);
          if (want === 1) chosen.push(cand[0]);
          else {
            const mx = cand.reduce((s, p) => s + p.x, 0) / cand.length, my = cand.reduce((s, p) => s + p.y, 0) / cand.length;
            let first = cand[0];
            for (const p of cand) if (Math.hypot(p.x - mx, p.y - my) > Math.hypot(first.x - mx, first.y - my)) first = p;
            chosen.push(first);
            while (chosen.length < want) {
              let best = null, bd = -1;
              for (const p of cand) {
                const dmin = Math.min(...chosen.map((q) => Math.hypot(p.x - q.x, p.y - q.y)));
                if (dmin > bd) {
                  bd = dmin;
                  best = p;
                }
              }
              if (!best || bd < 3 * r) break;
              chosen.push(best);
            }
          }
          const A = cells[ia], Bc = cells[ib];
          for (const p of chosen) {
            joints++;
            if (o.joint === "steck") {
              const peg = axisCylinder(axis, pv - 0.5, pv + o.depth - 0.4, p.x, p.y, r, 0.6);
              A.parts[0] = { ...A.parts[0], geom: B$1.union(A.parts[0].geom, peg) };
              const hole = axisCylinder(axis, pv - 0.01, pv + o.depth + 0.2, p.x, p.y, r + tol);
              Bc.parts = Bc.parts.map((q) => ({ ...q, geom: B$1.subtract(q.geom, hole) }));
            } else {
              const holeA = axisCylinder(axis, pv - o.depth - 0.2, pv + 0.01, p.x, p.y, r + tol);
              const holeB = axisCylinder(axis, pv - 0.01, pv + o.depth + 0.2, p.x, p.y, r + tol);
              A.parts = A.parts.map((q) => ({ ...q, geom: B$1.subtract(q.geom, holeA) }));
              Bc.parts = Bc.parts.map((q) => ({ ...q, geom: B$1.subtract(q.geom, holeB) }));
              const len = 2 * o.depth - 0.6;
              const seg = Math.max(24, Math.ceil(2 * Math.PI * r / 0.5 / 4) * 4);
              const c2 = 0.5;
              const pinGeom = srcExports.hulls.hull(
                P$1.cylinder({ radius: r - c2, height: len, segments: seg, center: [0, 0, len / 2] }),
                P$1.cylinder({ radius: r, height: len - 2 * c2, segments: seg, center: [0, 0, len / 2] })
              );
              pins.push({ label: `Dübel ${pins.length + 1}`, cell: [-1, -1, -1], parts: [{ slot: parts[0].slot, name: "Dübel", geom: pinGeom }], kind: "pin" });
            }
          }
          if (chosen.length < want && o.perFace > 0) warnings.push(`Schnitt ${"XYZ"[axis]} = ${pv.toFixed(1)} mm: nur ${chosen.length} von ${want} Verbindern passen.`);
        }
      });
    }
  }
  cells.forEach((c, i) => c.label = `Teil ${i + 1} (${c.cell[0] + 1}/${c.cell[1] + 1}/${c.cell[2] + 1})`);
  return { pieces: [...cells, ...pins], report: { counts, faces, joints, warnings } };
}
const QUANT = 1e-4;
function meshFromPolygons(polys) {
  const map = /* @__PURE__ */ new Map();
  const pos = [];
  const tri = [];
  const idx = (v) => {
    const key = `${Math.round(v[0] / QUANT)},${Math.round(v[1] / QUANT)},${Math.round(v[2] / QUANT)}`;
    let i = map.get(key);
    if (i === void 0) {
      i = pos.length / 3;
      pos.push(v[0], v[1], v[2]);
      map.set(key, i);
    }
    return i;
  };
  for (const poly of polys) {
    if (poly.length < 3) continue;
    const ids = poly.map(idx);
    const clean = [];
    for (const i of ids) if (clean[clean.length - 1] !== i) clean.push(i);
    if (clean.length > 1 && clean[0] === clean[clean.length - 1]) clean.pop();
    for (let k = 1; k + 1 < clean.length; k++) {
      const a = clean[0], b = clean[k], c = clean[k + 1];
      if (a !== b && b !== c && a !== c) tri.push(a, b, c);
    }
  }
  let m = { pos: new Float64Array(pos), tri: new Uint32Array(tri) };
  for (let pass = 0; pass < 3; pass++) {
    m = repairTJunctions(m);
    const cleaned = cleanTriangles(m);
    if (cleaned.tri.length === m.tri.length) break;
    m = cleaned;
  }
  return m;
}
function cleanTriangles(m) {
  const { pos, tri } = m;
  const keyOf = (a, b, c) => {
    const s = [a, b, c].sort((x, y) => x - y);
    return `${s[0]},${s[1]},${s[2]}`;
  };
  const orient = (a, b, c) => {
    if (a < b && a < c) return `${a},${b},${c}`;
    if (b < a && b < c) return `${b},${c},${a}`;
    return `${c},${a},${b}`;
  };
  const count = /* @__PURE__ */ new Map();
  const keep = [];
  for (let t = 0; t < tri.length; t += 3) {
    const a = tri[t], b = tri[t + 1], c = tri[t + 2];
    const ux = pos[3 * b] - pos[3 * a], uy = pos[3 * b + 1] - pos[3 * a + 1], uz = pos[3 * b + 2] - pos[3 * a + 2];
    const vx = pos[3 * c] - pos[3 * a], vy = pos[3 * c + 1] - pos[3 * a + 1], vz = pos[3 * c + 2] - pos[3 * a + 2];
    const cr = Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx);
    const lmax = Math.max(Math.hypot(ux, uy, uz), Math.hypot(vx, vy, vz), 1e-12);
    const degenerate = cr / lmax < 1e-7;
    keep.push(!degenerate);
    if (degenerate) continue;
    const k = keyOf(a, b, c);
    let e = count.get(k);
    if (!e) count.set(k, e = { n: 0, dirs: /* @__PURE__ */ new Map() });
    e.n++;
    const o = orient(a, b, c);
    e.dirs.set(o, (e.dirs.get(o) ?? 0) + 1);
  }
  const out = [];
  const emitted = /* @__PURE__ */ new Map();
  for (let t = 0, i = 0; t < tri.length; t += 3, i++) {
    if (!keep[i]) continue;
    const a = tri[t], b = tri[t + 1], c = tri[t + 2];
    const k = keyOf(a, b, c);
    const e = count.get(k);
    if (e.n > 1) {
      const dirs = [...e.dirs.values()];
      const net = dirs.length === 2 ? Math.abs(dirs[0] - dirs[1]) : dirs[0];
      const o = orient(a, b, c);
      const mine = e.dirs.get(o);
      const other = dirs.length === 2 ? dirs.find((_, j) => [...e.dirs.keys()][j] !== o) : 0;
      const allowed = mine > other ? Math.min(1, net) : 0;
      const done = emitted.get(k + "|" + o) ?? 0;
      if (done >= allowed) continue;
      emitted.set(k + "|" + o, done + 1);
    }
    out.push(a, b, c);
  }
  return { pos, tri: new Uint32Array(out) };
}
function edgeKey(a, b, n) {
  return a * n + b;
}
function repairTJunctions(m, maxPass = 4) {
  let pos = Array.from(m.pos);
  let tri = Array.from(m.tri);
  for (let pass = 0; pass < maxPass; pass++) {
    const n = pos.length / 3;
    const edges = /* @__PURE__ */ new Set();
    for (let t = 0; t < tri.length; t += 3)
      for (let e = 0; e < 3; e++) edges.add(edgeKey(tri[t + e], tri[t + (e + 1) % 3], n));
    const bad = [];
    for (let t = 0; t < tri.length; t += 3) {
      for (let e = 0; e < 3; e++) {
        const a = tri[t + e], b = tri[t + (e + 1) % 3];
        if (!edges.has(edgeKey(b, a, n))) {
          bad.push(t);
          break;
        }
      }
    }
    if (!bad.length) break;
    let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < pos.length; i += 3) {
      minX = Math.min(minX, pos[i]);
      maxX = Math.max(maxX, pos[i]);
      minY = Math.min(minY, pos[i + 1]);
      maxY = Math.max(maxY, pos[i + 1]);
      minZ = Math.min(minZ, pos[i + 2]);
      maxZ = Math.max(maxZ, pos[i + 2]);
    }
    const cs = Math.max(0.5, Math.max(maxX - minX, maxY - minY, maxZ - minZ) / 80);
    const grid = /* @__PURE__ */ new Map();
    const cell = (x, y, z) => `${Math.floor((x - minX) / cs)},${Math.floor((y - minY) / cs)},${Math.floor((z - minZ) / cs)}`;
    for (let i = 0; i < n; i++) {
      const k = cell(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]);
      let l = grid.get(k);
      if (!l) grid.set(k, l = []);
      l.push(i);
    }
    const pointsOnEdge = (a, b) => {
      const ax = pos[3 * a], ay = pos[3 * a + 1], az = pos[3 * a + 2];
      const dx = pos[3 * b] - ax, dy = pos[3 * b + 1] - ay, dz = pos[3 * b + 2] - az;
      const len2 = dx * dx + dy * dy + dz * dz;
      if (len2 < 1e-14) return [];
      const lo = [Math.min(ax, ax + dx), Math.min(ay, ay + dy), Math.min(az, az + dz)];
      const hi = [Math.max(ax, ax + dx), Math.max(ay, ay + dy), Math.max(az, az + dz)];
      const c0 = [Math.floor((lo[0] - minX) / cs) - 1, Math.floor((lo[1] - minY) / cs) - 1, Math.floor((lo[2] - minZ) / cs) - 1];
      const c1 = [Math.floor((hi[0] - minX) / cs) + 1, Math.floor((hi[1] - minY) / cs) + 1, Math.floor((hi[2] - minZ) / cs) + 1];
      const found = [];
      const eps = 2e-4;
      const ncell = (c1[0] - c0[0] + 1) * (c1[1] - c0[1] + 1) * (c1[2] - c0[2] + 1);
      const test = (i) => {
        if (i === a || i === b) return;
        const px = pos[3 * i] - ax, py = pos[3 * i + 1] - ay, pz = pos[3 * i + 2] - az;
        const t = (px * dx + py * dy + pz * dz) / len2;
        if (t <= 1e-7 || t >= 1 - 1e-7) return;
        const ex = px - t * dx, ey = py - t * dy, ez = pz - t * dz;
        if (ex * ex + ey * ey + ez * ez < eps * eps) found.push({ i, t });
      };
      if (ncell > 4e3) {
        for (let i = 0; i < n; i++) test(i);
      } else {
        for (let x = c0[0]; x <= c1[0]; x++)
          for (let y = c0[1]; y <= c1[1]; y++)
            for (let z = c0[2]; z <= c1[2]; z++) {
              const l = grid.get(`${x},${y},${z}`);
              if (l) for (const i of l) test(i);
            }
      }
      found.sort((p, q) => p.t - q.t);
      return found.map((f) => f.i);
    };
    const badSet = new Set(bad);
    const out = [];
    let changed = false;
    const limit = Math.max(3e6, tri.length * 6);
    const posLen0 = pos.length;
    let aborted = false;
    for (let t = 0; t < tri.length; t += 3) {
      if (out.length > limit || pos.length > limit) {
        aborted = true;
        break;
      }
      if (!badSet.has(t)) {
        out.push(tri[t], tri[t + 1], tri[t + 2]);
        continue;
      }
      const v = [tri[t], tri[t + 1], tri[t + 2]];
      const ring = [];
      let inserted = 0;
      for (let e = 0; e < 3; e++) {
        ring.push(v[e]);
        const pts = pointsOnEdge(v[e], v[(e + 1) % 3]);
        inserted += pts.length;
        ring.push(...pts);
      }
      if (!inserted) {
        out.push(...v);
        continue;
      }
      changed = true;
      const edgesHit = [0, 1, 2].filter((e) => pointsOnEdge(v[e], v[(e + 1) % 3]).length > 0);
      if (edgesHit.length === 1) {
        const e = edgesHit[0];
        const opp = v[(e + 2) % 3];
        const chain = [v[e], ...pointsOnEdge(v[e], v[(e + 1) % 3]), v[(e + 1) % 3]];
        for (let k = 0; k + 1 < chain.length; k++) out.push(chain[k], chain[k + 1], opp);
      } else {
        const c = pos.length / 3;
        pos.push(
          (pos[3 * v[0]] + pos[3 * v[1]] + pos[3 * v[2]]) / 3,
          (pos[3 * v[0] + 1] + pos[3 * v[1] + 1] + pos[3 * v[2] + 1]) / 3,
          (pos[3 * v[0] + 2] + pos[3 * v[1] + 2] + pos[3 * v[2] + 2]) / 3
        );
        for (let k = 0; k < ring.length; k++) out.push(ring[k], ring[(k + 1) % ring.length], c);
      }
    }
    if (aborted) {
      pos.length = posLen0;
      break;
    }
    tri = out;
    if (!changed) break;
  }
  return { pos: new Float64Array(pos), tri: new Uint32Array(tri) };
}
function analyzeMesh(m, overhangDeg = 45, bedZ) {
  const { pos, tri } = m;
  const n = pos.length / 3;
  const tcount = tri.length / 3;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.length; i += 3)
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], pos[i + k]);
      max[k] = Math.max(max[k], pos[i + k]);
    }
  const dir = /* @__PURE__ */ new Map();
  for (let t = 0; t < tri.length; t += 3)
    for (let e = 0; e < 3; e++) {
      const k = edgeKey(tri[t + e], tri[t + (e + 1) % 3], n);
      dir.set(k, (dir.get(k) ?? 0) + 1);
    }
  let open = 0, nonMan = 0;
  for (const [k, c] of dir) {
    const a = Math.floor(k / n), b = k % n;
    const r = dir.get(edgeKey(b, a, n)) ?? 0;
    if (c > 1) nonMan++;
    else if (r === 0) open++;
  }
  const parent = new Int32Array(n).map((_, i) => i);
  const find = (x) => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  for (let t = 0; t < tri.length; t += 3) {
    const a = find(tri[t]);
    parent[find(tri[t + 1])] = a;
    parent[find(tri[t + 2])] = a;
  }
  const roots = /* @__PURE__ */ new Set();
  for (let t = 0; t < tri.length; t += 3) roots.add(find(tri[t]));
  let vol = 0, area = 0, areaTB = 0, over = 0, bed = 0;
  const flags = new Uint8Array(tcount);
  const cosLim = Math.cos(overhangDeg * Math.PI / 180);
  const zBed = (bedZ ?? min[2]) + 0.05;
  for (let t = 0, f = 0; t < tri.length; t += 3, f++) {
    const a = 3 * tri[t], b = 3 * tri[t + 1], c = 3 * tri[t + 2];
    const ax = pos[a], ay = pos[a + 1], az = pos[a + 2];
    const bx = pos[b], by = pos[b + 1], bz = pos[b + 2];
    const cx = pos[c], cy = pos[c + 1], cz = pos[c + 2];
    vol += (ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx)) / 6;
    const ux = bx - ax, uy = by - ay, uz = bz - az;
    const vx = cx - ax, vy = cy - ay, vz = cz - az;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-12) continue;
    const ar = len / 2;
    area += ar;
    const z = nz / len;
    if (Math.abs(z) > 0.7) areaTB += ar;
    const onBed = az < zBed && bz < zBed && cz < zBed;
    if (onBed && z < -0.999) bed += ar;
    else if (z < -cosLim) {
      over += ar;
      flags[f] = 1;
    }
  }
  return {
    triangles: tcount,
    vertices: n,
    manifold: tcount > 0 && open === 0 && nonMan === 0,
    openEdges: open,
    nonManifoldEdges: nonMan,
    shells: roots.size,
    volume: Math.abs(vol),
    area,
    areaTB,
    min,
    max,
    overhangArea: over,
    overhangFlags: flags,
    bedContactArea: bed
  };
}
const MATERIALS = [
  { id: "pla", name: "PLA", density: 1.24 },
  { id: "petg", name: "PETG", density: 1.27 },
  { id: "abs", name: "ABS", density: 1.04 },
  { id: "asa", name: "ASA", density: 1.07 },
  { id: "tpu", name: "TPU", density: 1.21 },
  { id: "pacf", name: "PA-CF", density: 1.15 }
];
function estimatePrint(volume, area, areaTB, height, density, pr, layer = 0.2) {
  const line = 0.42;
  const side = Math.max(0, area - areaTB);
  const shell = Math.min(volume, side * pr.walls * line + areaTB / 2 * (pr.top + pr.bottom) * layer);
  const eff = pr.pattern === "lightning" ? pr.infill * 0.45 : pr.pattern === "adaptivecubic" ? pr.infill * 0.75 : pr.infill;
  const solid = shell + Math.max(0, volume - shell) * eff;
  const grams = solid / 1e3 * density;
  const meters = solid / (Math.PI * 0.875 * 0.875) / 1e3;
  const flow = 9;
  const layers = Math.max(1, height / layer);
  const minutes = (solid / flow + layers * 4) / 60 + 1.5;
  return { grams, meters, minutes };
}
function rotateMesh(m, rxDeg, ryDeg) {
  const rx = rxDeg * Math.PI / 180, ry = ryDeg * Math.PI / 180;
  const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
  const p = new Float64Array(m.pos.length);
  for (let i = 0; i < p.length; i += 3) {
    const x = m.pos[i], y = m.pos[i + 1], z = m.pos[i + 2];
    const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
    p[i] = x * cy + z1 * sy;
    p[i + 1] = y1;
    p[i + 2] = -x * sy + z1 * cy;
  }
  return { pos: p, tri: m.tri };
}
function mergeMeshes(ms) {
  let np = 0, nt = 0;
  for (const m of ms) {
    np += m.pos.length;
    nt += m.tri.length;
  }
  const pos = new Float64Array(np);
  const tri = new Uint32Array(nt);
  let op = 0, ot = 0;
  for (const m of ms) {
    pos.set(m.pos, op);
    const base = op / 3;
    for (let i = 0; i < m.tri.length; i++) tri[ot + i] = m.tri[i] + base;
    op += m.pos.length;
    ot += m.tri.length;
  }
  return { pos, tri };
}
function suppressSupportedOverhangs(parts) {
  if (parts.length < 2) return;
  const ups = /* @__PURE__ */ new Map();
  parts.forEach((p, pi) => {
    const { pos, tri } = p.mesh;
    for (let t = 0; t < tri.length; t += 3) {
      const a = 3 * tri[t], b = 3 * tri[t + 1], c = 3 * tri[t + 2];
      const nz = (pos[b] - pos[a]) * (pos[c + 1] - pos[a + 1]) - (pos[b + 1] - pos[a + 1]) * (pos[c] - pos[a]);
      if (nz <= 0) continue;
      if (Math.abs(pos[a + 2] - pos[b + 2]) > 1e-4 || Math.abs(pos[a + 2] - pos[c + 2]) > 1e-4) continue;
      const k = Math.round(pos[a + 2] * 100);
      if (!ups.has(k)) ups.set(k, []);
      ups.get(k).push([pos[a], pos[a + 1], pos[b], pos[b + 1], pos[c], pos[c + 1], pi]);
    }
  });
  const inTri = (x, y, q) => {
    const d1 = (x - q[2]) * (q[1] - q[3]) - (q[0] - q[2]) * (y - q[3]);
    const d2 = (x - q[4]) * (q[3] - q[5]) - (q[2] - q[4]) * (y - q[5]);
    const d3 = (x - q[0]) * (q[5] - q[1]) - (q[4] - q[0]) * (y - q[1]);
    const neg = d1 < -1e-9 || d2 < -1e-9 || d3 < -1e-9;
    const pos = d1 > 1e-9 || d2 > 1e-9 || d3 > 1e-9;
    return !(neg && pos);
  };
  parts.forEach((p, pi) => {
    const { pos, tri } = p.mesh;
    const f = p.stats.overhangFlags;
    for (let t = 0, i = 0; t < tri.length; t += 3, i++) {
      if (!f[i]) continue;
      const a = 3 * tri[t], b = 3 * tri[t + 1], c = 3 * tri[t + 2];
      if (Math.abs(pos[a + 2] - pos[b + 2]) > 1e-4 || Math.abs(pos[a + 2] - pos[c + 2]) > 1e-4) continue;
      const cand = ups.get(Math.round(pos[a + 2] * 100));
      if (!cand) continue;
      const cx = (pos[a] + pos[b] + pos[c]) / 3, cy = (pos[a + 1] + pos[b + 1] + pos[c + 1]) / 3;
      if (cand.some((q) => q[6] !== pi && inTri(cx, cy, q))) {
        f[i] = 0;
        const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1];
        p.stats.overhangArea -= Math.abs(ux * vy - uy * vx) / 2;
      }
    }
    p.stats.overhangArea = Math.max(0, p.stats.overhangArea);
  });
}
const { primitives: P, booleans: B, transforms: T, extrusions: E, expansions: X, hulls: H, geometries: G } = jscad;
const DEG = Math.PI / 180;
const MAX_NODES = 2e4;
const MAX_LOOP = 1e3;
class BuildError extends Error {
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function threadProfile(p, iso) {
  const crest = p / 8, root = iso ? p / 4 : p / 8;
  const depth = iso ? 0.5413 * p : (p - crest - root) / 2;
  const flank = (p - crest - root) / 2;
  return {
    depth,
    r: (phi) => {
      const x = phi * p;
      if (x < crest) return 0;
      if (x < crest + flank) return (x - crest) / flank * depth;
      if (x < crest + flank + root) return depth;
      return depth - (x - crest - flank - root) / flank * depth;
    }
  };
}
function threadGeom(d, p, h, iso, chamfer, left) {
  const { depth, r } = threadProfile(p, iso);
  const R = d / 2;
  const N = clamp(Math.round(Math.PI * d / 0.5 / 8) * 8, 48, 160);
  const rows = Math.max(2, Math.ceil(h / (p / 12)));
  const c = chamfer ? Math.min(depth, h / 4) : 0;
  const rad = (th, z) => {
    const phi = ((z / p + (left ? 1 : -1) * (th / (2 * Math.PI))) % 1 + 1) % 1;
    let rr = R - r(phi);
    if (c > 0) rr = Math.max(R - depth, Math.min(rr, R - c + Math.min(z, h - z)));
    return rr;
  };
  const P3 = [];
  for (let j = 0; j <= rows; j++) {
    const z = h * j / rows;
    const ring = [];
    for (let i = 0; i < N; i++) {
      const th = 2 * Math.PI * i / N;
      const rr = rad(th, z) + (j > 0 && j < rows ? 3e-3 * Math.sin(th * 7.3 + j * 2.1) : 0);
      ring.push([rr * Math.cos(th), rr * Math.sin(th), z]);
    }
    P3.push(ring);
  }
  const polys = [];
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < N; i++) {
      const a = P3[j][i], b2 = P3[j][(i + 1) % N], c2 = P3[j + 1][(i + 1) % N], d2 = P3[j + 1][i];
      polys.push([a, b2, c2], [a, c2, d2]);
    }
  const bc = [0, 0, 0], tc = [0, 0, h];
  for (let i = 0; i < N; i++) {
    polys.push([bc, P3[0][(i + 1) % N], P3[0][i]]);
    polys.push([tc, P3[rows][i], P3[rows][(i + 1) % N]]);
  }
  return G.geom3.fromPoints(polys);
}
function internalThreadGeom(d, p, h, iso, left, od, odfn, floor, chamfer) {
  const { r } = threadProfile(p, iso);
  const R = d / 2;
  const Ro = od / 2;
  let N = clamp(Math.round(Math.PI * d / 0.5 / 8) * 8, 48, 168);
  N = Math.ceil(N / 24) * 24;
  const fl = clamp(floor, 0, h - p);
  const rowsIn = Math.max(2, Math.ceil((h - fl) / (p / 12)));
  const outR = (th) => {
    if (odfn < 3) return Ro;
    const seg = 2 * Math.PI / odfn;
    const a = Ro * Math.cos(Math.PI / odfn);
    return a / Math.cos((th % seg + seg) % seg - Math.PI / odfn);
  };
  const rin = (th, z) => {
    const phi = ((z / p + (left ? 1 : -1) * (th / (2 * Math.PI))) % 1 + 1) % 1;
    let rr = R - r(phi);
    if (chamfer) {
      rr = Math.max(rr, R + 0.4 - (h - z));
      if (fl <= 0) rr = Math.max(rr, R + 0.4 - z);
    }
    return Math.min(rr, Math.min(outR(th), Ro) - 0.6);
  };
  const ang = Array.from({ length: N }, (_, i) => 2 * Math.PI * i / N);
  const ring = (f, z) => ang.map((th) => [f(th) * Math.cos(th), f(th) * Math.sin(th), z]);
  const outB = ring(outR, 0), outT = ring(outR, h);
  const inner = [];
  for (let j = 0; j <= rowsIn; j++) {
    const z = fl + (h - fl) * j / rowsIn;
    inner.push(ring((th) => rin(th, z) + (j > 0 && j < rowsIn ? 3e-3 * Math.sin(th * 7.3 + j * 2.1) : 0), z));
  }
  const polys = [];
  const nx = (i) => (i + 1) % N;
  for (let i = 0; i < N; i++) {
    polys.push([outB[i], outB[nx(i)], outT[nx(i)]], [outB[i], outT[nx(i)], outT[i]]);
    const it = inner[rowsIn];
    polys.push([outT[i], outT[nx(i)], it[nx(i)]], [outT[i], it[nx(i)], it[i]]);
    for (let j = 0; j < rowsIn; j++) {
      const a = inner[j][i], b = inner[j][nx(i)], c = inner[j + 1][nx(i)], e = inner[j + 1][i];
      polys.push([a, c, b], [a, e, c]);
    }
    if (fl > 0) {
      polys.push([[0, 0, 0], outB[nx(i)], outB[i]]);
      polys.push([[0, 0, fl], inner[0][i], inner[0][nx(i)]]);
    } else {
      const ib = inner[0];
      polys.push([outB[i], ib[i], ib[nx(i)]], [outB[i], ib[nx(i)], outB[nx(i)]]);
    }
  }
  return G.geom3.fromPoints(polys);
}
function domeGeom(R, w, rows, holes, hole, top) {
  const Ri = R - w;
  const NP = clamp(Math.round(Math.PI / 2 * R / 1.6), 16, 60);
  let NA = clamp(Math.round(2 * Math.PI * R / 1.6), 48, 200);
  const per = holes > 0 ? Math.max(4, Math.round(NA / holes)) : NA;
  if (holes > 0) NA = per * holes;
  const dphi = Math.PI / 2 / NP, dth = 2 * Math.PI / NA;
  const topRows = top > 0 ? clamp(Math.round(Math.asin(Math.min(1, top / 2 / R)) / dphi), 1, NP - 4) : 0;
  const solid = Array.from({ length: NP }, (_, i) => Array.from({ length: NA }, () => i >= topRows));
  if (holes > 0 && rows > 0 && hole > 0) {
    const hr = Math.max(1, Math.round(hole / (R * dphi)));
    const free0 = topRows + 2, free1 = NP - 3;
    for (let k = 0; k < rows; k++) {
      const ci = Math.round(free0 + (k + 1) * (free1 - free0) / (rows + 1));
      const i0 = clamp(ci - Math.floor(hr / 2), free0, free1 - hr);
      const phiC = (ci + 0.5) * dphi;
      const wc = clamp(Math.round(hole / (R * Math.sin(phiC) * dth)), 1, per - 2);
      const off = k % 2 ? Math.floor(per / 2) : 0;
      for (let h = 0; h < holes; h++) {
        const j0 = h * per + off + Math.floor((per - wc) / 2);
        for (let i = i0; i < i0 + hr; i++) for (let jj = 0; jj < wc; jj++) solid[i][(j0 + jj) % NA] = false;
      }
    }
  }
  const pt = (r, i, j) => {
    const phi = i * dphi, th = j * dth;
    if (i === 0) return [0, 0, r];
    return [r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi)];
  };
  const O = (i, j) => pt(R, i, (j % NA + NA) % NA);
  const I = (i, j) => pt(Ri, i, (j % NA + NA) % NA);
  const polys = [];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const face = (pts, dir) => {
    const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]));
    const p = dot(n, dir) >= 0 ? pts : [...pts].reverse();
    for (let k = 1; k < p.length - 1; k++) polys.push([p[0], p[k], p[k + 1]]);
  };
  const mid = (i, j) => pt((R + Ri) / 2, i, j);
  const cellC = (i, j) => {
    const phi = (i + 0.5) * dphi, th = (j + 0.5) * dth, r = (R + Ri) / 2;
    return [r * Math.sin(phi) * Math.cos(th), r * Math.sin(phi) * Math.sin(th), r * Math.cos(phi)];
  };
  const S = (i, j) => i >= 0 && i < NP && solid[i][(j % NA + NA) % NA];
  for (let i = 0; i < NP; i++)
    for (let j = 0; j < NA; j++) {
      if (!S(i, j)) continue;
      const c = cellC(i, j);
      if (i === 0) {
        face([O(0, 0), O(1, j), O(1, j + 1)], c);
        face([I(0, 0), I(1, j), I(1, j + 1)], [-c[0], -c[1], -c[2]]);
      } else {
        face([O(i, j), O(i + 1, j), O(i + 1, j + 1), O(i, j + 1)], c);
        face([I(i, j), I(i + 1, j), I(i + 1, j + 1), I(i, j + 1)], [-c[0], -c[1], -c[2]]);
      }
      if (!S(i, j - 1)) face([O(i, j), O(i + 1, j), I(i + 1, j), I(i, j)], sub(cellC(i, j - 1), c));
      if (!S(i, j + 1)) face([O(i, j + 1), O(i + 1, j + 1), I(i + 1, j + 1), I(i, j + 1)], sub(cellC(i, j + 1), c));
      if (i > 0 && !S(i - 1, j)) face([O(i, j), O(i, j + 1), I(i, j + 1), I(i, j)], sub(i - 1 >= 0 ? cellC(i - 1, j) : mid(0, j), c));
      if (i === NP - 1) face([O(NP, j), O(NP, j + 1), I(NP, j + 1), I(NP, j)], [0, 0, -1]);
      else if (!S(i + 1, j)) face([O(i + 1, j), O(i + 1, j + 1), I(i + 1, j + 1), I(i + 1, j)], sub(cellC(i + 1, j), c));
    }
  return G.geom3.fromPoints(polys);
}
function radialGeom(o) {
  const rMax = Math.max(o.r0, o.r1) + Math.abs(o.bulge) + Math.abs(o.amp);
  let N = clamp(Math.round(2 * Math.PI * rMax / 0.8), 72, 360);
  const per = o.pattern !== "none" ? Math.max(1, o.count) : 1;
  N = Math.max(per * 4, Math.round(N / (per * 4)) * per * 4);
  const rowStep = o.pattern === "none" ? 1 : Math.min(0.8, o.pitch / 8);
  const rows = Math.max(2, Math.ceil(o.h / rowStep));
  const groove = (x) => Math.max(0, 1 - Math.abs((x % 1 + 1) % 1 - 0.5) * 4);
  const outR = (th, z) => {
    const t = z / o.h;
    let r = o.r0 + (o.r1 - o.r0) * t + o.bulge * Math.sin(Math.PI * t);
    if (o.sides >= 3) {
      const seg = 2 * Math.PI / o.sides;
      const tw = o.twist * Math.PI / 180;
      const a = ((th - tw * t) % seg + seg) % seg;
      r *= Math.cos(Math.PI / o.sides) / Math.cos(a - Math.PI / o.sides);
    }
    if (o.waves > 0 && o.amp) r += o.amp * Math.sin(o.waves * (th - o.twist * Math.PI / 180 * t));
    const u = th / (2 * Math.PI) * o.count;
    if (o.pattern === "raendel") r -= o.depth * Math.max(groove(u + z / o.pitch), groove(u - z / o.pitch));
    else if (o.pattern === "rillen") r -= o.depth * groove(u);
    else if (o.pattern === "wellen") r -= o.depth * (0.5 + 0.5 * Math.sin(2 * Math.PI * (u + z / o.pitch)));
    else if (o.pattern === "waben") {
      const row = Math.floor(z / (o.pitch * 0.866));
      const vu = u + row % 2 * 0.5;
      const vz = z / (o.pitch * 0.866) % 1 - 0.5;
      const du = (vu % 1 + 1) % 1 - 0.5;
      r -= o.depth * Math.max(0, 1 - Math.hypot(du * 2, vz * 2.2) * 1.15);
    }
    return Math.max(0.5, r);
  };
  const hollow = o.wall > 0;
  const fl = hollow ? clamp(o.floor, 0.4, o.h - 0.5) : 0;
  const ang = Array.from({ length: N }, (_, i) => 2 * Math.PI * i / N);
  const ringAt = (z, f, j, jitter) => ang.map((th) => {
    const r = f(th) + (jitter ? 3e-3 * Math.sin(th * 7.3 + j * 2.1) : 0);
    return [r * Math.cos(th), r * Math.sin(th), z];
  });
  const outer = [];
  for (let j = 0; j <= rows; j++) {
    const z = o.h * j / rows;
    outer.push(ringAt(z, (th) => outR(th, z), j, j > 0 && j < rows));
  }
  const polys = [];
  const nx = (i) => (i + 1) % N;
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < N; i++) {
      const a = outer[j][i], b = outer[j][nx(i)], c = outer[j + 1][nx(i)], d = outer[j + 1][i];
      polys.push([a, b, c], [a, c, d]);
    }
  const cap = (ring, z, up) => {
    const rIn = Math.max(0.2, Math.min(...ring.map((p) => Math.hypot(p[0], p[1]))) * 0.9);
    const inner = ang.map((th) => [rIn * Math.cos(th), rIn * Math.sin(th), z]);
    polys.push(up ? inner : [...inner].reverse());
    for (let i = 0; i < N; i++) {
      const a = ring[i], b = ring[nx(i)], c = inner[nx(i)], d = inner[i];
      if (up) polys.push([a, b, c], [a, c, d]);
      else polys.push([a, c, b], [a, d, c]);
    }
  };
  cap(outer[0], 0, false);
  if (!hollow) {
    cap(outer[rows], o.h, true);
  } else {
    const innerRows = Math.max(2, Math.ceil((o.h - fl) / rowStep));
    const inner = [];
    for (let j = 0; j <= innerRows; j++) {
      const z = fl + (o.h - fl) * j / innerRows;
      inner.push(ringAt(z, (th) => Math.max(0.3, outR(th, z) - o.wall - (o.pattern !== "none" ? 0 : 0)), j, j > 0 && j < innerRows));
    }
    for (let j = 0; j < innerRows; j++)
      for (let i = 0; i < N; i++) {
        const a = inner[j][i], b = inner[j][nx(i)], c = inner[j + 1][nx(i)], d = inner[j + 1][i];
        polys.push([a, c, b], [a, d, c]);
      }
    const top = outer[rows], it = inner[innerRows];
    for (let i = 0; i < N; i++) polys.push([top[i], top[nx(i)], it[nx(i)]], [top[i], it[nx(i)], it[i]]);
    cap(inner[0], fl, true);
  }
  return G.geom3.fromPoints(polys);
}
function segs(r, fn) {
  if (fn && fn >= 3) return Math.max(4, Math.ceil(fn / 4) * 4);
  const n = 2 * Math.PI * r / 0.5;
  return clamp(Math.ceil(n / 16) * 16, 32, 160);
}
const v2 = (v, s, w) => [num(v[0], s, w), num(v[1], s, w)];
const v3 = (v, s, w) => [num(v[0], s, w), num(v[1], s, w), num(v[2], s, w)];
function positive(n, what) {
  if (!(n > 0)) throw new BuildError(`${what} muss größer als 0 sein (ist ${n.toFixed(3)})`);
  return n;
}
function radius(n, s, what) {
  if (n.r !== void 0) return positive(num(n.r, s, what), what);
  return positive(num(n.d, s, what) / 2, what);
}
function signedArea(pts) {
  let a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) a += (pts[j][0] - pts[i][0]) * (pts[j][1] + pts[i][1]);
  return a / 2;
}
function ccw(pts) {
  const out = [];
  for (const p of pts) {
    const q = out[out.length - 1];
    if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6) out.push(p);
  }
  if (out.length > 1) {
    const f = out[0], l = out[out.length - 1];
    if (Math.hypot(f[0] - l[0], f[1] - l[1]) < 1e-6) out.pop();
  }
  if (out.length < 3) throw new BuildError("Polygon hat weniger als 3 unterschiedliche Punkte");
  return signedArea(out) < 0 ? out.reverse() : out;
}
function shape2d(sh, s) {
  switch (sh.type) {
    case "rect": {
      const [w, h] = v2(sh.size, s, "rect.size");
      positive(w, "Rechteck-Breite");
      positive(h, "Rechteck-Höhe");
      const center = sh.center ? [0, 0] : [w / 2, h / 2];
      const r = sh.r !== void 0 ? num(sh.r, s, "rect.r") : 0;
      if (r > 1e-3) {
        const rr = Math.min(r, Math.min(w, h) / 2 - 1e-3);
        if (rr > 1e-3) return P.roundedRectangle({ size: [w, h], roundRadius: rr, segments: segs(rr) * 1, center });
      }
      return P.rectangle({ size: [w, h], center });
    }
    case "circle": {
      const r = radius(sh, s, "Kreisradius");
      return P.circle({ radius: r, segments: segs(r, sh.fn !== void 0 ? num(sh.fn, s) : void 0) });
    }
    case "polygon": {
      const outer = ccw(sh.points.map((p) => v2(p, s, "polygon.points")));
      let g = P.polygon({ points: outer });
      if (sh.holes && sh.holes.length) {
        const holes = sh.holes.filter((h) => h.length >= 3).map((h) => P.polygon({ points: ccw(h.map((p) => v2(p, s, "polygon.holes"))) }));
        if (holes.length) g = B.subtract(g, ...holes);
      }
      if (sh.offset !== void 0) {
        const d = num(sh.offset, s, "polygon.offset");
        if (Math.abs(d) > 1e-4) g = X.offset({ delta: d, corners: "round", segments: 32 }, g);
      }
      return g;
    }
  }
  throw new BuildError(`Unbekannte 2D-Form`);
}
function unionAll(list) {
  const l = list.filter(Boolean);
  if (l.length === 0) return null;
  if (l.length === 1) return l[0];
  return B.union(...l);
}
function children(nodes, ctx) {
  const out = [];
  for (const n of nodes ?? []) out.push(...build(n, ctx));
  return out;
}
function build(n, ctx) {
  if (++ctx.count.n > MAX_NODES) throw new BuildError("Modell zu komplex (zu viele Knoten / Schleifen)");
  const s = ctx.scope;
  switch (n.type) {
    case "cube": {
      const size = v3(n.size, s, "cube.size");
      size.forEach((x, i) => positive(x, `Quader-Maß ${"XYZ"[i]}`));
      return [P.cuboid({ size, center: n.center ? [0, 0, 0] : [size[0] / 2, size[1] / 2, size[2] / 2] })];
    }
    case "roundedCube": {
      const size = v3(n.size, s, "roundedCube.size");
      size.forEach((x, i) => positive(x, `Quader-Maß ${"XYZ"[i]}`));
      const center = n.center ? [0, 0, 0] : [size[0] / 2, size[1] / 2, size[2] / 2];
      const r = Math.min(num(n.r, s, "roundedCube.r"), Math.min(...size) / 2 - 1e-3);
      if (r <= 0.01) return [P.cuboid({ size, center })];
      return [P.roundedCuboid({ size, center, roundRadius: r, segments: clamp(Math.ceil(2 * Math.PI * r / 0.6 / 4) * 4, 8, 48) })];
    }
    case "cylinder": {
      const h = positive(num(n.h, s, "cylinder.h"), "Zylinderhöhe");
      const fn = n.fn !== void 0 ? num(n.fn, s) : void 0;
      const center = [0, 0, n.center ? 0 : h / 2];
      if (n.r1 !== void 0 && n.r2 !== void 0) {
        const r1 = Math.max(num(n.r1, s, "r1"), 0);
        const r2 = Math.max(num(n.r2, s, "r2"), 0);
        if (r1 <= 0 && r2 <= 0) throw new BuildError("Kegel: r1 und r2 sind beide 0");
        const sg = segs(Math.max(r1, r2), fn);
        if (Math.abs(r1 - r2) < 1e-6) return [P.cylinder({ height: h, radius: r1, segments: sg, center })];
        return [
          P.cylinderElliptic({
            height: h,
            startRadius: [Math.max(r1, 1e-3), Math.max(r1, 1e-3)],
            endRadius: [Math.max(r2, 1e-3), Math.max(r2, 1e-3)],
            segments: sg,
            center
          })
        ];
      }
      const r = radius(n, s, "Zylinderradius");
      return [P.cylinder({ height: h, radius: r, segments: segs(r, fn), center })];
    }
    case "sphere": {
      const r = radius(n, s, "Kugelradius");
      return [P.sphere({ radius: r, segments: segs(r, n.fn !== void 0 ? num(n.fn, s) : void 0) })];
    }
    case "extrude": {
      const h = positive(num(n.h, s, "extrude.h"), "Extrusionshöhe");
      let g = E.extrudeLinear({ height: h }, shape2d(n.shape, s));
      if (n.center) g = T.translate([0, 0, -h / 2], g);
      return [g];
    }
    case "revolve": {
      const angle2 = n.angle !== void 0 ? num(n.angle, s, "revolve.angle") : 360;
      const g2 = shape2d(n.shape, s);
      const fn = n.fn !== void 0 ? num(n.fn, s) : 96;
      if (angle2 >= 359.999) return [E.extrudeRotate({ segments: Math.max(8, Math.round(fn)) }, g2)];
      return [E.extrudeRotate({ segments: Math.max(8, Math.round(fn)), angle: angle2 * DEG }, g2)];
    }
    case "radial": {
      const o = (x, d, what) => x === void 0 ? d : num(x, s, what);
      return [
        radialGeom({
          h: positive(num(n.h, s, "radial.h"), "Höhe"),
          r0: positive(num(n.r0, s, "radial.r0"), "Radius"),
          r1: o(n.r1, num(n.r0, s, "radial.r0"), "radial.r1"),
          bulge: o(n.bulge, 0, "radial.bulge"),
          sides: Math.round(o(n.sides, 0, "radial.sides")),
          waves: Math.round(o(n.waves, 0, "radial.waves")),
          amp: o(n.amp, 0, "radial.amp"),
          twist: o(n.twist, 0, "radial.twist"),
          pattern: n.pattern ?? "none",
          depth: o(n.depth, 0.6, "radial.depth"),
          count: Math.round(o(n.count, 24, "radial.count")),
          pitch: o(n.pitch, 6, "radial.pitch"),
          wall: o(n.wall, 0, "radial.wall"),
          floor: o(n.floor, 1.2, "radial.floor")
        })
      ];
    }
    case "dome": {
      const R = positive(num(n.r, s, "dome.r"), "Kuppel-Radius");
      const w = positive(num(n.wall, s, "dome.wall"), "Wandstärke");
      if (w >= R * 0.8) throw new BuildError("Wandstärke zu groß für die Kuppel");
      const o = (x, d, what) => x === void 0 ? d : num(x, s, what);
      return [domeGeom(R, w, Math.round(o(n.rows, 0, "dome.rows")), Math.round(o(n.holes, 0, "dome.holes")), o(n.hole, 0, "dome.hole"), o(n.top, 0, "dome.top"))];
    }
    case "thread": {
      const d = positive(num(n.d, s, "thread.d"), "Gewinde-Durchmesser");
      const p = positive(num(n.pitch, s, "thread.pitch"), "Steigung");
      const h = positive(num(n.h, s, "thread.h"), "Gewindelänge");
      if (p > d / 2) throw new BuildError("Steigung zu groß für den Durchmesser");
      if (n.internal) {
        const od = positive(num(n.od ?? `${d} + 4`, s, "thread.od"), "Außendurchmesser");
        if (od <= d + 0.4) throw new BuildError("Außendurchmesser zu klein für das Innengewinde");
        const odfn = n.odfn !== void 0 ? Math.round(num(n.odfn, s, "thread.odfn")) : 0;
        const fl = n.floor !== void 0 ? num(n.floor, s, "thread.floor") : 0;
        return [internalThreadGeom(d, p, h, !!n.iso, !!n.left, od, odfn, fl, n.chamfer !== false)];
      }
      return [threadGeom(d, p, h, !!n.iso, !!n.chamfer, !!n.left)];
    }
    case "teardrop": {
      const r = radius(n, s, "Tropfenloch-Radius");
      const h = positive(num(n.h, s, "teardrop.h"), "Tropfenloch-Länge");
      const profile = H.hull(
        P.circle({ radius: r, segments: segs(r) }),
        P.rectangle({ size: [0.02, 0.02], center: [0, r * Math.SQRT2] })
      );
      let g = T.translate([0, 0, -h / 2], E.extrudeLinear({ height: h }, profile));
      const axis = n.axis ?? "x";
      if (axis === "y") g = T.rotateX(90 * DEG, g);
      else if (axis === "x") g = T.rotateZ(90 * DEG, T.rotateX(90 * DEG, g));
      return [g];
    }
    case "union": {
      const u = unionAll(children(n.children, ctx));
      return u ? [u] : [];
    }
    case "difference": {
      const kids = n.children ?? [];
      if (!kids.length) return [];
      const first = unionAll(build(kids[0], ctx));
      if (!first) return [];
      const rest = children(kids.slice(1), ctx);
      return [rest.length ? B.subtract(first, ...rest) : first];
    }
    case "intersection": {
      const parts = (n.children ?? []).map((c) => unionAll(build(c, ctx))).filter(Boolean);
      if (!parts.length) return [];
      return [parts.length === 1 ? parts[0] : B.intersect(...parts)];
    }
    case "hull": {
      const parts = children(n.children, ctx);
      if (!parts.length) return [];
      return [parts.length === 1 ? parts[0] : H.hull(...parts)];
    }
    case "translate": {
      const g = unionAll(children(n.children, ctx));
      return g ? [T.translate(v3(n.v, s, "translate.v"), g)] : [];
    }
    case "rotate": {
      let g = unionAll(children(n.children, ctx));
      if (!g) return [];
      const [ax, ay, az] = v3(n.a, s, "rotate.a");
      if (ax) g = T.rotateX(ax * DEG, g);
      if (ay) g = T.rotateY(ay * DEG, g);
      if (az) g = T.rotateZ(az * DEG, g);
      return [g];
    }
    case "mirror": {
      const g = unionAll(children(n.children, ctx));
      const nv = v3(n.v, s, "mirror.v");
      if (!g) return [];
      if (Math.hypot(...nv) < 1e-9) throw new BuildError("mirror.v darf nicht [0,0,0] sein");
      return [T.mirror({ normal: nv }, g)];
    }
    case "scale": {
      const g = unionAll(children(n.children, ctx));
      const sv = v3(n.v, s, "scale.v");
      sv.forEach((x) => {
        if (!Number.isFinite(x) || Math.abs(x) < 1e-6) throw new BuildError(`Skalierungsfaktor darf nicht 0 sein (ist ${x})`);
      });
      if (!g) return [];
      let out = T.scale(sv.map(Math.abs), g);
      sv.forEach((x, k) => {
        if (x < 0) out = T.mirror({ normal: [k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0] }, out);
      });
      return [out];
    }
    case "text":
      return [
        textSolid(
          fillText(n.text, s),
          num(n.size, s, "text.size"),
          num(n.h, s, "text.h"),
          n.stroke !== void 0 ? num(n.stroke, s, "text.stroke") : void 0,
          n.center !== false,
          n.maxW !== void 0 ? num(n.maxW, s, "text.maxW") : void 0
        )
      ];
    case "import": {
      const im = getImported(n.ref);
      if (!im) throw new BuildError("Eine importierte Datei fehlt auf diesem Gerät – bitte erneut importieren");
      const tris = im.mesh.tri.length / 3;
      if (tris > 6e4) throw new BuildError(`„${im.name}“ ist mit ${tris.toLocaleString("de-DE")} Dreiecken zu fein, um es als Loch zu verwenden (max. 60.000) – als Körper geht es.`);
      const sz = v3(n.size, s, "import.size");
      const k = [0, 1, 2].map((i) => im.size[i] > 0 ? sz[i] / im.size[i] : 1);
      const polys = [];
      const P3 = im.mesh.pos;
      for (let t = 0; t < im.mesh.tri.length; t += 3)
        polys.push([0, 1, 2].map((j) => {
          const i = im.mesh.tri[t + j] * 3;
          return [P3[i] * k[0], P3[i + 1] * k[1], P3[i + 2] * k[2]];
        }));
      return [G.geom3.fromPoints(polys)];
    }
    case "color": {
      const u = unionAll(children(n.children, ctx));
      return u ? [u] : [];
    }
    case "if":
      return bool(n.cond, s) ? children(n.then, ctx) : children(n.else, ctx);
    case "for": {
      const from = num(n.from, s, "for.from");
      const to = num(n.to, s, "for.to");
      const step = n.step !== void 0 ? num(n.step, s, "for.step") : 1;
      if (step === 0) throw new BuildError("for.step darf nicht 0 sein");
      const out = [];
      let k = 0;
      for (let i = from; step > 0 ? i <= to + 1e-9 : i >= to - 1e-9; i += step) {
        if (++k > MAX_LOOP) throw new BuildError(`Schleife "${n.var}" hat mehr als ${MAX_LOOP} Durchläufe`);
        out.push(...children(n.children, { scope: { ...s, [n.var]: i }, count: ctx.count }));
      }
      const u = unionAll(out);
      return u ? [u] : [];
    }
  }
  throw new BuildError(`Unbekannter Knotentyp "${n.type}"`);
}
function makeScope(model, values, g) {
  const scope = { tol: g.tol, fase: g.fase };
  for (const p of model.params) scope[p.key] = values[p.key] ?? p.value;
  return scope;
}
function textSolid(text2, size0, h, stroke, center, maxW) {
  positive(size0, "Schriftgröße");
  positive(h, "Texthöhe");
  const input = normalizeText(text2);
  let size = size0;
  let segments = srcExports.text.vectorText({ height: size, input });
  if (maxW && maxW > 0) {
    const xs = segments.flat().map((p) => p[0]);
    const width = xs.length ? Math.max(...xs) - Math.min(...xs) + (stroke && stroke > 0 ? stroke : size * 0.16) : 0;
    if (width > maxW) {
      size = Math.max(1, size * maxW / width);
      segments = srcExports.text.vectorText({ height: size, input });
    }
  }
  const sw = Math.min(stroke && stroke > 0 ? stroke : Math.max(0.6, size * 0.16), size * 0.3);
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const r = sw / 2;
  const strokes = [];
  for (const seg of segments) {
    if (!seg || seg.length < 2) continue;
    const pts = [];
    for (const p of seg) {
      const q = pts[pts.length - 1];
      if (!q || Math.hypot(p[0] - q[0], p[1] - q[1]) > r * 0.25) pts.push(p);
    }
    if (pts.length === 1) pts.push(seg[seg.length - 1]);
    for (const [x, y] of pts) {
      minX = Math.min(minX, x - r);
      maxX = Math.max(maxX, x + r);
      minY = Math.min(minY, y - r);
      maxY = Math.max(maxY, y + r);
    }
    const dots = pts.map(([x, y]) => P.cylinder({ radius: r, height: h, segments: 16, center: [x, y, h / 2] }));
    strokes.push(dots.length === 1 ? dots[0] : H.hullChain(...dots));
  }
  if (!strokes.length) throw new BuildError("Text ergibt keine Geometrie");
  let g = strokes.length === 1 ? strokes[0] : B.union(...strokes);
  if (center) g = T.translate([-(minX + maxX) / 2, -(minY + maxY) / 2, 0], g);
  return g;
}
function polysOf(g) {
  return G.geom3.toPolygons(g).map((p) => p.vertices);
}
function bbox(geoms) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const g of geoms) {
    const [a, b] = srcExports.measurements.measureBoundingBox(g);
    for (let i = 0; i < 3; i++) {
      min[i] = Math.min(min[i], a[i]);
      max[i] = Math.max(max[i], b[i]);
    }
  }
  return { min, max };
}
const HOLLOW_DIRS = (() => {
  const d = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1]
  ];
  const k = 1 / Math.sqrt(3);
  for (const x of [-k, k]) for (const y of [-k, k]) for (const z of [-k, k]) d.push([x, y, z]);
  return d;
})();
function hollowGeom(g, o, jitter = 731e-5) {
  const t = o.wall / 0.8 + jitter;
  let inner = g;
  for (const [x, y, z] of HOLLOW_DIRS) inner = B.intersect(inner, T.translate([x * t, y * t, z * t], g));
  if (!polysOf(inner).length) return { geom: g, hollowed: false };
  const bb = bbox([inner]);
  const size = [0, 1, 2].map((i) => bb.max[i] - bb.min[i]);
  if (size.some((v) => v < 1)) return { geom: g, hollowed: false };
  if (o.roof) {
    const along = size[0] >= size[1] ? 0 : 1;
    const across = along === 0 ? 1 : 0;
    const c0 = bb.min[across], c1 = bb.max[across];
    const hw = (c1 - c0) / 2 + 71e-4, cc = (c0 + c1) / 2 + 29e-4;
    const apex = bb.max[2] + 0.0137;
    const z0 = bb.min[2] - 1;
    const pts = [
      [cc - hw - 1, z0],
      [cc + hw + 1, z0],
      [cc + hw + 1, apex - hw - 1],
      [cc, apex],
      [cc - hw - 1, apex - hw - 1]
    ];
    let roof = E.extrudeLinear({ height: size[along] + 4 }, P.polygon({ points: pts }));
    roof = T.rotateX(Math.PI / 2, roof);
    if (along === 0) roof = T.rotateZ(Math.PI / 2, roof);
    const rb = bbox([roof]);
    const shift = [0, 0, 0];
    shift[along] = bb.min[along] - 2 - rb.min[along];
    roof = T.translate(shift, roof);
    inner = B.intersect(inner, roof);
    if (!polysOf(inner).length) return { geom: g, hollowed: false };
  }
  return { geom: B.subtract(g, inner), hollowed: true };
}
function buildExtras(model, values, g, o, t) {
  if (!model.extras?.length) return [];
  const ctx = { scope: makeScope(model, values, g), count: { n: 0 } };
  const xs = model.xform?.scale;
  return model.extras.map((ex) => {
    let gg = unionAll(children(xs && xs.some((v) => v !== 1) ? [{ type: "scale", v: xs, children: [ex.node] }] : [ex.node], ctx));
    if (!gg) return { extra: ex, polys: [] };
    if (o.rx) gg = T.rotateX(o.rx * DEG, gg);
    if (o.ry) gg = T.rotateY(o.ry * DEG, gg);
    gg = T.translate(t, gg);
    return { extra: ex, polys: polysOf(gg) };
  });
}
function buildParts(model, values, g, o, zones, split, hollow) {
  const ctx = { scope: makeScope(model, values, g), count: { n: 0 } };
  const groups = [];
  const groupFor = (slot, name) => {
    let gr = groups.find((x) => x.slot === slot);
    if (!gr) groups.push(gr = { slot, name, geoms: [] });
    return gr;
  };
  const xs = model.xform?.scale;
  const wrap = (ns) => xs && xs.some((v) => v !== 1) ? [{ type: "scale", v: xs, children: ns }] : ns;
  try {
    for (const n of model.root) {
      if (n.type === "color") {
        const slot = clamp(Math.round(num(n.slot, ctx.scope, "color.slot")), 1, 8);
        groupFor(slot, n.name || `Farbe ${slot}`).geoms.push(...children(wrap(n.children), ctx));
      } else groupFor(1, "Basis").geoms.push(...children(wrap([n]), ctx));
    }
    let parts = groups.map((gr) => ({ slot: gr.slot, name: gr.name, geom: unionAll(gr.geoms) })).filter((p) => p.geom);
    if (!parts.length) throw new BuildError("Das Modell ist leer");
    for (let i = 0; i < parts.length - 1; i++) {
      const mine = bbox([parts[i].geom]);
      const overlapping = parts.slice(i + 1).filter((p) => {
        const b = bbox([p.geom]);
        return [0, 1, 2].every((k) => Math.min(mine.max[k], b.max[k]) - Math.max(mine.min[k], b.min[k]) > 1e-3);
      });
      const later = unionAll(overlapping.map((p) => p.geom));
      if (later) parts[i].geom = B.subtract(parts[i].geom, later);
    }
    parts = parts.map((p) => {
      let gg = p.geom;
      if (o.rx) gg = T.rotateX(o.rx * DEG, gg);
      if (o.ry) gg = T.rotateY(o.ry * DEG, gg);
      return { ...p, geom: gg };
    });
    parts = parts.filter((p) => polysOf(p.geom).length > 0);
    if (!parts.length) throw new BuildError("Das Modell ist leer");
    const bb = bbox(parts.map((p) => p.geom));
    const t = [-(bb.min[0] + bb.max[0]) / 2, -(bb.min[1] + bb.max[1]) / 2, -bb.min[2]];
    parts = parts.map((p) => ({ ...p, geom: T.translate(t, p.geom) }));
    const height = bb.max[2] - bb.min[2];
    if (model.mods && (model.mods.sub.length || model.mods.add.length)) {
      const sub = unionAll(children(model.mods.sub, ctx));
      const add = unionAll(children(model.mods.add, ctx));
      if (sub) parts = parts.map((p) => ({ ...p, geom: B.subtract(p.geom, sub) }));
      if (add) parts[0] = { ...parts[0], geom: B.union(parts[0].geom, add) };
    }
    let hollowNote;
    if (hollow?.enabled && parts.length) {
      let done = false;
      for (const jitter of [731e-5, 0.0613, 0.137]) {
        const h = hollowGeom(parts[0].geom, hollow, jitter);
        if (!h.hollowed) {
          hollowNote = "Zu dünn für einen Hohlraum – Teil bleibt massiv.";
          done = true;
          break;
        }
        if (analyzeMesh(meshFromPolygons(polysOf(h.geom))).manifold) {
          parts[0] = { ...parts[0], geom: h.geom };
          hollowNote = void 0;
          done = true;
          break;
        }
      }
      if (!done) hollowNote = "Hohlraum ließ sich hier nicht sauber bauen – Teil bleibt massiv (100 % druckbar).";
    }
    if (zones && zones.length > 1) {
      const zs = [...zones].sort((a, b) => a.z - b.z);
      const all = unionAll(parts.map((p) => p.geom));
      const W = bb.max[0] - bb.min[0] + 20;
      const D = bb.max[1] - bb.min[1] + 20;
      const zoned = [];
      for (let k = 0; k < zs.length; k++) {
        const z0 = k === 0 ? -1 : clamp(zs[k].z, 0, height);
        const z1 = k === zs.length - 1 ? height + 1 : clamp(zs[k + 1].z, 0, height + 1);
        if (z1 - z0 < 0.01) continue;
        const slab = P.cuboid({ size: [W, D, z1 - z0], center: [0, 0, (z0 + z1) / 2] });
        const part = B.intersect(all, slab);
        if (polysOf(part).length) zoned.push({ slot: zs[k].slot, name: `Zone ${k + 1}`, geom: part });
      }
      const merged = [];
      for (const z of zoned) {
        const m = merged.find((x) => x.slot === z.slot);
        if (m) m.geom = B.union(m.geom, z.geom);
        else merged.push(z);
      }
      parts = merged;
    }
    let pieces;
    let splitReport;
    if (split?.opts.enabled) {
      const res = splitParts(parts, bbox(parts.map((p) => p.geom)), split.opts, split.bed, g.tol);
      splitReport = res.report;
      pieces = res.pieces.map((pc) => ({
        label: pc.label,
        kind: pc.kind,
        cell: pc.cell,
        parts: pc.parts.map((p) => ({ slot: p.slot, name: p.name, polys: polysOf(p.geom) })).filter((p) => p.polys.length)
      }));
    }
    return {
      parts: parts.map((p) => ({ slot: p.slot, name: p.name, polys: polysOf(p.geom) })),
      pieces,
      splitReport,
      hollowNote,
      placement: { rx: o.rx, ry: o.ry, t }
    };
  } catch (e) {
    if (e instanceof BuildError || e instanceof ExprError) throw e;
    throw new BuildError(`Geometriefehler: ${e.message}`);
  }
}
function rotV(v, rot) {
  const [a, b, c] = rot.map((d) => d * Math.PI / 180);
  let [x, y, z] = v;
  [y, z] = [y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
  [x, z] = [x * Math.cos(b) + z * Math.sin(b), -x * Math.sin(b) + z * Math.cos(b)];
  [x, y] = [x * Math.cos(c) - y * Math.sin(c), x * Math.sin(c) + y * Math.cos(c)];
  return [x, y, z];
}
function earPoints(m, maxAngle = 110, minEdge = 1.5, minDist = 8) {
  const P2 = m.pos, T2 = m.tri;
  const edges = /* @__PURE__ */ new Map();
  const key = (a, b) => `${a},${b}`;
  for (let t = 0; t < T2.length; t += 3) {
    const a = T2[t], b = T2[t + 1], c = T2[t + 2];
    if (P2[a * 3 + 2] > 0.02 || P2[b * 3 + 2] > 0.02 || P2[c * 3 + 2] > 0.02) continue;
    for (const [u, v] of [
      [a, b],
      [b, c],
      [c, a]
    ])
      edges.set(key(u, v), [u, v]);
  }
  const next = /* @__PURE__ */ new Map();
  for (const [u, v] of edges.values()) if (!edges.has(key(v, u))) next.set(u, v);
  const prev = /* @__PURE__ */ new Map();
  for (const [u, v] of next) prev.set(v, u);
  const out = [];
  for (const [v, b] of next) {
    const a = prev.get(v);
    if (a === void 0) continue;
    const ax = P2[v * 3] - P2[a * 3], ay = P2[v * 3 + 1] - P2[a * 3 + 1];
    const bx = P2[b * 3] - P2[v * 3], by = P2[b * 3 + 1] - P2[v * 3 + 1];
    const la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    if (la < minEdge || lb < minEdge) continue;
    const cross = ax * by - ay * bx;
    if (cross >= 0) continue;
    const inner = 180 - Math.acos(Math.max(-1, Math.min(1, (ax * bx + ay * by) / (la * lb)))) * 180 / Math.PI;
    if (inner > maxAngle) continue;
    const p = [P2[v * 3], P2[v * 3 + 1]];
    if (out.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < minDist)) continue;
    out.push(p);
  }
  return out;
}
function earDiscs(points, d, h) {
  const N = 40;
  const pos = [];
  const tri = [];
  for (const [x, y] of points) {
    const o = pos.length / 3;
    pos.push(x, y, 0, x, y, h);
    for (let i = 0; i < N; i++) {
      const a = 2 * Math.PI * i / N;
      pos.push(x + d / 2 * Math.cos(a), y + d / 2 * Math.sin(a), 0);
      pos.push(x + d / 2 * Math.cos(a), y + d / 2 * Math.sin(a), h);
    }
    for (let i = 0; i < N; i++) {
      const b0 = o + 2 + 2 * i, t0 = b0 + 1, b1 = o + 2 + 2 * ((i + 1) % N), t1 = b1 + 1;
      tri.push(o, b1, b0);
      tri.push(o + 1, t0, t1);
      tri.push(b0, b1, t1, b0, t1, t0);
    }
  }
  return { pos: new Float64Array(pos), tri: new Uint32Array(tri) };
}
function slotColor(palette, slot) {
  return palette.find((p) => p.slot === slot)?.color ?? "#b8c2cc";
}
function translateMesh(m, d) {
  const p = new Float64Array(m.pos.length);
  for (let i = 0; i < p.length; i += 3) {
    p[i] = m.pos[i] + d[0];
    p[i + 1] = m.pos[i + 1] + d[1];
    p[i + 2] = m.pos[i + 2] + d[2];
  }
  return { pos: p, tri: m.tri };
}
function bounds(ms) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const m of ms)
    for (let i = 0; i < m.pos.length; i += 3)
      for (let k = 0; k < 3; k++) {
        min[k] = Math.min(min[k], m.pos[i + k]);
        max[k] = Math.max(max[k], m.pos[i + k]);
      }
  return { min, max };
}
function countSwaps(parts, height, layer) {
  const slots = [...new Set(parts.map((p) => p.slot))];
  if (slots.length < 2) return 0;
  let swaps = 0, last = -1;
  for (let z = layer / 2; z < height; z += layer) {
    const present = slots.filter((sl) => parts.some((p) => p.slot === sl && p.stats.min[2] <= z && p.stats.max[2] >= z));
    if (!present.length) continue;
    if (last >= 0 && present[0] !== last) swaps++;
    swaps += present.length - 1;
    last = present[present.length - 1];
  }
  return swaps;
}
const ORIENTS = [
  [0, 0],
  [180, 0],
  [90, 0],
  [-90, 0],
  [0, 90],
  [0, -90]
];
function scaleMesh(m, k) {
  if (!k || k[0] === 1 && k[1] === 1 && k[2] === 1) return m;
  const p = new Float64Array(m.pos.length);
  for (let i = 0; i < p.length; i += 3) {
    p[i] = m.pos[i] * k[0];
    p[i + 1] = m.pos[i + 1] * k[1];
    p[i + 2] = m.pos[i + 2] * k[2];
  }
  if (k[0] * k[1] * k[2] < 0) {
    const t = new Uint32Array(m.tri);
    for (let i = 0; i < t.length; i += 3) [t[i + 1], t[i + 2]] = [t[i + 2], t[i + 1]];
    return { pos: p, tri: t };
  }
  return { pos: p, tri: m.tri };
}
function importToMesh(im) {
  const src2 = getImported(im.ref);
  if (!src2) throw new Error(`Die importierte Datei „${im.name}“ fehlt auf diesem Gerät – bitte erneut importieren`);
  const k = [0, 1, 2].map((i) => src2.size[i] > 0 ? im.size[i] / src2.size[i] : 1);
  const p = new Float64Array(src2.mesh.pos.length);
  const rot = im.rot.some((v) => v);
  for (let i = 0; i < p.length; i += 3) {
    let v = [src2.mesh.pos[i] * k[0], src2.mesh.pos[i + 1] * k[1], src2.mesh.pos[i + 2] * k[2]];
    if (rot) v = rotV(v, im.rot);
    p[i] = v[0] + im.pos[0];
    p[i + 1] = v[1] + im.pos[1];
    p[i + 2] = v[2] + im.pos[2];
  }
  if (k[0] * k[1] * k[2] < 0) {
    const t = new Uint32Array(src2.mesh.tri);
    for (let i = 0; i < t.length; i += 3) [t[i + 1], t[i + 2]] = [t[i + 2], t[i + 1]];
    return { pos: p, tri: t };
  }
  return { pos: p, tri: src2.mesh.tri };
}
function runPipeline(model, values, s) {
  const t0 = performance.now();
  const bed = { size: s.bedSize, height: s.bedHeight };
  const imports = model.imports ?? [];
  const splitOn = s.split.enabled && !imports.length;
  const out = model.root.length ? buildParts(model, values, s.globals, s.orientation, s.zones, splitOn ? { opts: s.split, bed } : void 0, s.hollow) : { parts: [], placement: { rx: s.orientation.rx, ry: s.orientation.ry, t: [0, 0, 0] }, pieces: void 0, splitReport: void 0, hollowNote: void 0 };
  const density = MATERIALS.find((m) => m.id === s.material)?.density ?? 1.24;
  const mk = (slot, name, mesh) => ({ slot, name, color: slotColor(s.palette, slot), mesh, stats: analyzeMesh(mesh, s.overhangDeg, 0) });
  let parts = out.parts.map((p) => mk(p.slot, p.name, meshFromPolygons(p.polys)));
  if (imports.length) {
    const t = out.placement.t;
    const im = imports.map((x) => ({ x, mesh: translateMesh(rotateMesh(scaleMesh(importToMesh(x), model.xform?.scale), s.orientation.rx, s.orientation.ry), t) }));
    const b = bounds([...parts.map((p) => p.mesh), ...im.map((i) => i.mesh)]);
    const d = [-(b.min[0] + b.max[0]) / 2, -(b.min[1] + b.max[1]) / 2, -b.min[2]];
    const moved = Math.abs(d[0]) + Math.abs(d[1]) + Math.abs(d[2]) > 1e-9;
    parts = [
      ...parts.map((p) => moved ? mk(p.slot, p.name, translateMesh(p.mesh, d)) : p),
      ...im.map((i) => mk(i.x.slot, `Import: ${i.x.name}`, moved ? translateMesh(i.mesh, d) : i.mesh))
    ];
    out.placement = { ...out.placement, t: [t[0] + d[0], t[1] + d[1], t[2] + d[2]] };
  }
  if (s.ears && s.ears > 0 && !out.pieces && parts.length) {
    const pts = earPoints(mergeMeshes(parts.map((p) => p.mesh)));
    if (pts.length) parts.push(mk(parts[0].slot, `Mausohren (${pts.length})`, earDiscs(pts, s.ears, Math.max(0.2, s.layer * 2))));
  }
  const extraParts = [];
  if (model.extras?.length && !out.pieces) {
    for (const { extra, polys } of buildExtras(model, values, s.globals, s.orientation, out.placement.t)) {
      if (!polys.length) continue;
      const mesh = meshFromPolygons(polys);
      extraParts.push({ slot: 0, name: extra.name, color: extra.role === "modifier" ? "#f2c94c" : extra.role === "blocker" ? "#ff6b6b" : "#4dabf7", mesh, stats: analyzeMesh(mesh, s.overhangDeg, 0), role: extra.role, infill: extra.infill, walls: extra.walls });
    }
  }
  const total = analyzeMesh(mergeMeshes(parts.map((p) => p.mesh)), s.overhangDeg);
  suppressSupportedOverhangs(parts);
  total.overhangArea = parts.reduce((a, p) => a + p.stats.overhangArea, 0);
  total.manifold = parts.every((p) => p.stats.manifold);
  total.openEdges = parts.reduce((a, p) => a + p.stats.openEdges, 0);
  total.nonManifoldEdges = parts.reduce((a, p) => a + p.stats.nonManifoldEdges, 0);
  const height = total.max[2] - total.min[2];
  const size = [total.max[0] - total.min[0], total.max[1] - total.min[1], height];
  const estimate = estimatePrint(total.volume, total.area, total.areaTB, height, density, s.profile, s.layer);
  const swaps = countSwaps(parts, height, s.layer);
  estimate.minutes += swaps * 45 / 60;
  const res = {
    parts: [...parts, ...extraParts],
    total,
    estimate,
    ms: 0,
    placement: out.placement,
    fitsBed: size[0] <= s.bedSize && size[1] <= s.bedSize && size[2] <= s.bedHeight,
    swaps,
    purgeGrams: swaps * 0.4,
    hollowNote: out.hollowNote
  };
  if (model.inserts?.length && !out.pieces) {
    const D = Math.PI / 180;
    const k = model.xform?.scale ?? [1, 1, 1];
    const t = out.placement.t;
    const zOf = (x, y, z) => {
      x *= k[0];
      y *= k[1];
      z *= k[2];
      const a = s.orientation.rx * D, b = s.orientation.ry * D;
      const z1 = y * Math.sin(a) + z * Math.cos(a);
      return -x * Math.sin(b) + z1 * Math.cos(b) + t[2];
    };
    res.pauses = model.inserts.map((ins) => {
      let top = -Infinity;
      for (const x of [ins.min[0], ins.max[0]]) for (const y of [ins.min[1], ins.max[1]]) for (const z of [ins.min[2], ins.max[2]]) top = Math.max(top, zOf(x, y, z));
      return { top, label: ins.label };
    }).sort((a, b) => a.top - b.top);
  }
  if (imports.length) {
    const open = parts.filter((p) => p.name.startsWith("Import: ") && !p.stats.manifold);
    if (open.length) res.importNote = `${open.map((p) => `„${p.name.slice(8)}“`).join(", ")} hat offene Kanten – Bambu Studio/Orca reparieren das beim Laden meist automatisch.`;
    if (s.split.enabled) res.importNote = (res.importNote ? res.importNote + " " : "") + "Aufteilen auf mehrere Platten geht mit importierten Dateien noch nicht – nutze dafür die Baugruppe.";
  }
  if (out.pieces) {
    res.splitReport = out.splitReport;
    const pieces = out.pieces.map((pc) => {
      const assembled = pc.parts.map((p) => mk(p.slot, p.name, meshFromPolygons(p.polys)));
      let best = { o: [0, 0], score: Infinity };
      const merged = mergeMeshes(assembled.map((a) => a.mesh));
      const cands = pc.kind === "pin" ? [[0, 0]] : ORIENTS;
      for (const [rx, ry] of cands) {
        const st = analyzeMesh(rotateMesh(merged, rx, ry), s.overhangDeg);
        const fits = st.max[0] - st.min[0] <= s.bedSize && st.max[1] - st.min[1] <= s.bedSize && st.max[2] - st.min[2] <= s.bedHeight;
        const score = st.overhangArea - st.bedContactArea * 0.05 + (fits ? 0 : 1e9) + (st.max[2] - st.min[2]) * 0.01;
        if (score < best.score) best = { o: [rx, ry], score };
      }
      const rotated = assembled.map((a) => rotateMesh(a.mesh, best.o[0], best.o[1]));
      const b = bounds(rotated);
      const d = [-(b.min[0] + b.max[0]) / 2, -(b.min[1] + b.max[1]) / 2, -b.min[2]];
      const local = rotated.map((m, i) => mk(assembled[i].slot, assembled[i].name, translateMesh(m, d)));
      suppressSupportedOverhangs(assembled);
      suppressSupportedOverhangs(local);
      return {
        label: pc.label,
        kind: pc.kind,
        cell: pc.cell,
        assembled,
        local,
        size: [b.max[0] - b.min[0], b.max[1] - b.min[1], b.max[2] - b.min[2]],
        orientation: { rx: best.o[0], ry: best.o[1] },
        manifold: local.every((l) => l.stats.manifold)
      };
    });
    const gap = 6;
    const usable = s.bedSize - 4;
    const order = pieces.map((_, i) => i).sort((a, b) => pieces[b].size[1] - pieces[a].size[1] || pieces[b].size[0] - pieces[a].size[0]);
    const plates = [];
    for (const i of order) {
      const [w, dd] = pieces[i].size;
      let placed = false;
      for (const pl of plates) {
        if (pl.x + w <= usable && pl.y + dd <= usable) {
          pl.items.push({ piece: i, x: pl.x, y: pl.y });
          pl.x += w + gap;
          pl.rowH = Math.max(pl.rowH, dd);
          placed = true;
          break;
        }
        const ny = pl.y + pl.rowH + gap;
        if (w <= usable && ny + dd <= usable) {
          pl.y = ny;
          pl.x = 0;
          pl.rowH = dd;
          pl.items.push({ piece: i, x: 0, y: ny });
          pl.x = w + gap;
          placed = true;
          break;
        }
      }
      if (!placed) plates.push({ items: [{ piece: i, x: 0, y: 0 }], x: w + gap, y: 0, rowH: dd });
    }
    const plateResults = plates.map((pl, k) => {
      const maxX = Math.max(...pl.items.map((it) => it.x + pieces[it.piece].size[0]));
      const maxY = Math.max(...pl.items.map((it) => it.y + pieces[it.piece].size[1]));
      const items = pl.items.map((it) => {
        const pc = pieces[it.piece];
        const dx = -maxX / 2 + it.x + pc.size[0] / 2, dy = -maxY / 2 + it.y + pc.size[1] / 2;
        return { piece: it.piece, parts: pc.local.map((l) => ({ ...l, mesh: translateMesh(l.mesh, [dx, dy, 0]) })) };
      });
      const all = items.flatMap((it) => it.parts);
      const st = analyzeMesh(mergeMeshes(all.map((p) => p.mesh)), s.overhangDeg);
      const h = st.max[2] - st.min[2];
      const est = estimatePrint(st.volume, st.area, st.areaTB, h, density, s.profile, s.layer);
      const sw = countSwaps(
        all.map((p) => ({ slot: p.slot, stats: analyzeMesh(p.mesh, s.overhangDeg) })),
        h,
        s.layer
      );
      est.minutes += sw * 45 / 60;
      return { index: k + 1, items, estimate: est, height: h };
    });
    res.pieces = pieces;
    res.plates = plateResults;
    res.estimate = {
      grams: plateResults.reduce((a, p) => a + p.estimate.grams, 0),
      meters: plateResults.reduce((a, p) => a + p.estimate.meters, 0),
      minutes: plateResults.reduce((a, p) => a + p.estimate.minutes, 0)
    };
    res.total = { ...res.total, manifold: pieces.every((p) => p.manifold) };
    res.fitsBed = pieces.every((p) => p.size[0] <= s.bedSize && p.size[1] <= s.bedSize && p.size[2] <= s.bedHeight);
  }
  res.ms = performance.now() - t0;
  return res;
}
self.onmessage = async (e) => {
  const { id, model, values, settings, imports } = e.data;
  try {
    for (const im of imports) await registerImported(im, false);
    const r = runPipeline(model, values, settings);
    self.postMessage({ id, ok: true, result: r });
  } catch (err) {
    self.postMessage({ id, ok: false, error: err?.message ?? String(err) });
  }
};
self.postMessage({ ready: true });
