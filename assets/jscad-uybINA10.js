var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
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
  const isZero = (num) => Math.abs(num) < Number.EPSILON;
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
      const v2 = subtract([], e1.head().point, e0.head().point);
      const t = [];
      const v1 = [];
      this.nVertices = 2;
      this.normal = [0, 0, 0];
      while (e2 !== e0) {
        copy(v1, v2);
        subtract(v2, e2.head().point, e0.head().point);
        add(this.normal, this.normal, cross(t, v1, v2));
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
    static createTriangle(v0, v1, v2, minArea = 0) {
      const face = new Face();
      const e0 = new HalfEdge(v0, face);
      const e1 = new HalfEdge(v1, face);
      const e2 = new HalfEdge(v2, face);
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
      let v2, v3;
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
            v2 = vertex;
          }
        }
      }
      const normal = getPlaneNormal2([], v0.point, v1.point, v2.point);
      const distPO = dot(v0.point, normal);
      maxDistance = -1;
      for (i = 0; i < this.vertices.length; i += 1) {
        const vertex = this.vertices[i];
        if (vertex !== v0 && vertex !== v1 && vertex !== v2) {
          const distance = Math.abs(dot(normal, vertex.point) - distPO);
          if (distance > maxDistance) {
            maxDistance = distance;
            v3 = vertex;
          }
        }
      }
      const faces = [];
      if (dot(v3.point, normal) - distPO < 0) {
        faces.push(
          Face.createTriangle(v0, v1, v2),
          Face.createTriangle(v3, v1, v0),
          Face.createTriangle(v3, v2, v1),
          Face.createTriangle(v3, v0, v2)
        );
        for (i = 0; i < 3; i += 1) {
          const j2 = (i + 1) % 3;
          faces[i + 1].getEdge(2).setOpposite(faces[0].getEdge(j2));
          faces[i + 1].getEdge(1).setOpposite(faces[j2 + 1].getEdge(0));
        }
      } else {
        faces.push(
          Face.createTriangle(v0, v2, v1),
          Face.createTriangle(v3, v0, v1),
          Face.createTriangle(v3, v1, v2),
          Face.createTriangle(v3, v2, v0)
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
        if (vertex !== v0 && vertex !== v1 && vertex !== v2 && vertex !== v3) {
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
  const cache = /* @__PURE__ */ new WeakMap();
  const measureBoundingSphere = (polygon) => {
    const boundingSphere = cache.get(polygon);
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
    cache.set(polygon, out);
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
        const v2 = `${vertices[(i + 1) % vertices.length]}`;
        const edge = `${v1}/${v2}`;
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
    let { endpoint, radius, xaxisrotation, clockwise, large, segments } = Object.assign({}, defaults, options);
    if (!Array.isArray(endpoint)) throw new Error("endpoint must be an array of X and Y values");
    if (endpoint.length < 2) throw new Error("endpoint must contain X and Y values");
    endpoint = vec22.clone(endpoint);
    if (!Array.isArray(radius)) throw new Error("radius must be an array of X and Y values");
    if (radius.length < 2) throw new Error("radius must contain X and Y values");
    if (segments < 4) throw new Error("segments must be four or more");
    const decimals = 1e5;
    if (geometry.isClosed) {
      throw new Error("the given path cannot be closed");
    }
    const points = toPoints(geometry);
    if (points.length < 1) {
      throw new Error("the given path must contain one or more points (as the starting point for the arc)");
    }
    let xradius = radius[0];
    let yradius = radius[1];
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
    const v3 = vec32.create();
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
      const sinangle = vec22.cross(v3, dir1, dir2);
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
  const cache = /* @__PURE__ */ new WeakMap();
  const measureAreaOfPath2 = () => 0;
  const measureAreaOfGeom2 = (geometry) => {
    let area = cache.get(geometry);
    if (area) return area;
    const sides = geom22.toSides(geometry);
    area = sides.reduce((area2, side) => area2 + (side[0][0] * side[1][1] - side[0][1] * side[1][0]), 0);
    area *= 0.5;
    cache.set(geometry, area);
    return area;
  };
  const measureAreaOfGeom3 = (geometry) => {
    let area = cache.get(geometry);
    if (area) return area;
    const polygons = geom32.toPolygons(geometry);
    area = polygons.reduce((area2, polygon) => area2 + poly32.measureArea(polygon), 0);
    cache.set(geometry, area);
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
  const cache = /* @__PURE__ */ new WeakMap();
  const measureBoundingBoxOfPath2 = (geometry) => {
    let boundingBox = cache.get(geometry);
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
    cache.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBoxOfGeom2 = (geometry) => {
    let boundingBox = cache.get(geometry);
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
    cache.set(geometry, boundingBox);
    return boundingBox;
  };
  const measureBoundingBoxOfGeom3 = (geometry) => {
    let boundingBox = cache.get(geometry);
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
    cache.set(geometry, boundingBox);
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
    const bounds = measureBoundingBox(geometries2);
    if (geometries2.length === 1) {
      return bounds;
    }
    const result = [[Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE], [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE]];
    return bounds.reduce((result2, item) => {
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
  const calculateEpsilonFromBounds = (bounds, dimensions) => {
    let total = 0;
    for (let i = 0; i < dimensions; i++) {
      total += bounds[1][i] - bounds[0][i];
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
    const bounds = measureAggregateBoundingBox(geometries2);
    let dimensions = 0;
    dimensions = geometries2.reduce((dimensions2, geometry) => {
      if (path22.isA(geometry) || geom22.isA(geometry)) return Math.max(dimensions2, 2);
      if (geom32.isA(geometry)) return Math.max(dimensions2, 3);
      return 0;
    }, dimensions);
    return calculateEpsilonFromBounds(bounds, dimensions);
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
  const cache = /* @__PURE__ */ new WeakMap();
  const measureVolumeOfPath2 = () => 0;
  const measureVolumeOfGeom2 = () => 0;
  const measureVolumeOfGeom3 = (geometry) => {
    let volume = cache.get(geometry);
    if (volume) return volume;
    const polygons = geom32.toPolygons(geometry);
    volume = polygons.reduce((volume2, polygon) => volume2 + poly32.measureSignedVolume(polygon), 0);
    cache.set(geometry, volume);
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
    let radius = 0;
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
        radius = Math.max(radius, vec22.squaredDistance(centroid, point));
      });
      radius = Math.sqrt(radius);
    }
    boundingSphere = [centroid, radius];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphereOfGeom2 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0) return boundingSphere;
    const centroid = vec32.create();
    let radius = 0;
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
        radius = Math.max(radius, vec22.squaredDistance(centroid, side[0]));
      });
      radius = Math.sqrt(radius);
    }
    boundingSphere = [centroid, radius];
    cacheOfBoundingSpheres.set(geometry, boundingSphere);
    return boundingSphere;
  };
  const measureBoundingSphereOfGeom3 = (geometry) => {
    let boundingSphere = cacheOfBoundingSpheres.get(geometry);
    if (boundingSphere !== void 0) return boundingSphere;
    const centroid = vec32.create();
    let radius = 0;
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
          radius = Math.max(radius, vec32.squaredDistance(centroid, point));
        });
      });
      radius = Math.sqrt(radius);
    }
    boundingSphere = [centroid, radius];
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
      const bounds = measureBoundingBox(geometry);
      return [
        bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2,
        bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2,
        bounds[0][2] + (bounds[1][2] - bounds[0][2]) / 2
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
    let { center, radius, startAngle, endAngle, makeTangent, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 2)) throw new Error("center must be an array of X and Y values");
    if (!isGT(radius, 0)) throw new Error("radius must be greater than zero");
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
    const minangle = Math.acos((radius * radius + radius * radius - EPS * EPS) / (2 * radius * radius));
    const centerv = vec22.clone(center);
    let point;
    const pointArray = [];
    if (rotation < minangle) {
      point = vec22.fromAngleRadians(vec22.create(), startAngle);
      vec22.scale(point, point, radius);
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
        vec22.scale(point, point, radius);
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
    let { center, radius, startAngle, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 2)) throw new Error("center must be an array of X and Y values");
    if (!isNumberArray(radius, 2)) throw new Error("radius must be an array of X and Y values");
    if (!radius.every((n) => n >= 0)) throw new Error("radius values must be positive");
    if (!isGTE(startAngle, 0)) throw new Error("startAngle must be positive");
    if (!isGTE(endAngle, 0)) throw new Error("endAngle must be positive");
    if (!isGTE(segments, 3)) throw new Error("segments must be three or more");
    if (radius[0] === 0 || radius[1] === 0) return geom22.create();
    startAngle = startAngle % TAU;
    endAngle = endAngle % TAU;
    let rotation = TAU;
    if (startAngle < endAngle) {
      rotation = endAngle - startAngle;
    }
    if (startAngle > endAngle) {
      rotation = endAngle + (TAU - startAngle);
    }
    const minradius = Math.min(radius[0], radius[1]);
    const minangle = Math.acos((minradius * minradius + minradius * minradius - EPS * EPS) / (2 * minradius * minradius));
    if (rotation < minangle) throw new Error("startAngle and endAngle do not define a significant rotation");
    segments = Math.floor(segments * (rotation / TAU));
    const centerv = vec22.clone(center);
    const step = rotation / segments;
    const points = [];
    segments = rotation < TAU ? segments + 1 : segments;
    for (let i = 0; i < segments; i++) {
      const angle2 = step * i + startAngle;
      const point = vec22.fromValues(radius[0] * cos(angle2), radius[1] * sin(angle2));
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
    let { center, radius, startAngle, endAngle, segments } = Object.assign({}, defaults, options);
    if (!isGTE(radius, 0)) throw new Error("radius must be positive");
    radius = [radius, radius];
    return ellipse({ center, radius, startAngle, endAngle, segments });
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
    const v2 = vec32.create();
    const v3 = vec32.create();
    const point = (stack, slice2, radius) => {
      const angle2 = slice2 * rotation + startAngle;
      vec32.scale(v1, axisX, radius[0] * cos(angle2));
      vec32.scale(v2, axisY, radius[1] * sin(angle2));
      vec32.add(v1, v1, v2);
      vec32.scale(v3, ray, stack);
      vec32.add(v3, v3, start);
      return vec32.add(vec32.create(), v1, v3);
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
    const { center, height, radius, segments } = Object.assign({}, defaults, options);
    if (!isGTE(radius, 0)) throw new Error("radius must be positive");
    if (height === 0 || radius === 0) return geom32.create();
    const newoptions = {
      center,
      height,
      startRadius: [radius, radius],
      endRadius: [radius, radius],
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
    const { center, radius, segments, axes } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 3)) throw new Error("center must be an array of X, Y and Z values");
    if (!isNumberArray(radius, 3)) throw new Error("radius must be an array of X, Y and Z values");
    if (!radius.every((n) => n >= 0)) throw new Error("radius values must be positive");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    if (radius[0] === 0 || radius[1] === 0 || radius[2] === 0) return geom32.create();
    const xvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), axes[0]), radius[0]);
    const yvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), axes[1]), radius[1]);
    const zvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), axes[2]), radius[2]);
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
    let { radius, frequency } = Object.assign({}, defaults, options);
    if (!isGTE(radius, 0)) throw new Error("radius must be positive");
    if (!isGTE(frequency, 6)) throw new Error("frequency must be six or more");
    if (radius === 0) return geom32.create();
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
    if (radius !== 1) geometry = geom32.transform(mat42.fromScaling(mat42.create(), [radius, radius, radius]), geometry);
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
  const createCorners = (center, size, radius, segments, slice2, positive) => {
    const pitch = TAU / 4 * slice2 / segments;
    const cospitch = cos(pitch);
    const sinpitch = sin(pitch);
    const layersegments = segments - slice2;
    let layerradius = radius * cospitch;
    let layeroffset = size[2] - (radius - radius * sinpitch);
    if (!positive) layeroffset = radius - radius * sinpitch - size[2];
    layerradius = layerradius > EPS ? layerradius : 0;
    const corner0 = vec32.add(vec32.create(), center, [size[0] - radius, size[1] - radius, layeroffset]);
    const corner1 = vec32.add(vec32.create(), center, [radius - size[0], size[1] - radius, layeroffset]);
    const corner2 = vec32.add(vec32.create(), center, [radius - size[0], radius - size[1], layeroffset]);
    const corner3 = vec32.add(vec32.create(), center, [size[0] - radius, radius - size[1], layeroffset]);
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
    if (!positive) {
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
    const { center, height, radius, roundRadius, segments } = Object.assign({}, defaults, options);
    if (!isNumberArray(center, 3)) throw new Error("center must be an array of X, Y and Z values");
    if (!isGTE(height, 0)) throw new Error("height must be positive");
    if (!isGTE(radius, 0)) throw new Error("radius must be positive");
    if (!isGTE(roundRadius, 0)) throw new Error("roundRadius must be positive");
    if (roundRadius > radius) throw new Error("roundRadius must be smaller than the radius");
    if (!isGTE(segments, 4)) throw new Error("segments must be four or more");
    if (height === 0 || radius === 0) return geom32.create();
    if (roundRadius === 0) return cylinder({ center, height, radius });
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
    const xvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), vec32.cross(vec32.create(), zvector, defaultnormal)), radius);
    const yvector = vec32.scale(vec32.create(), vec32.normalize(vec32.create(), vec32.cross(vec32.create(), xvector, zvector)), radius);
    vec32.add(start, start, zvector);
    vec32.subtract(end, end, zvector);
    const qsegments = Math.floor(0.25 * segments);
    const fromPoints = (points) => {
      const newpoints = points.map((point) => vec32.add(point, point, center));
      return poly32.create(newpoints);
    };
    const polygons = [];
    const v1 = vec32.create();
    const v2 = vec32.create();
    let prevcylinderpoint;
    for (let slice1 = 0; slice1 <= segments; slice1++) {
      const angle2 = TAU * slice1 / segments;
      const cylinderpoint = vec32.add(vec32.create(), vec32.scale(v1, xvector, cos(angle2)), vec32.scale(v2, yvector, sin(angle2)));
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
            point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, prevcylinderpoint, prevcospitch), vec32.scale(v2, zvector, prevsinpitch)));
            points.push(point);
            point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, cylinderpoint, prevcospitch), vec32.scale(v2, zvector, prevsinpitch)));
            points.push(point);
            if (slice2 < qsegments) {
              point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, cylinderpoint, cospitch), vec32.scale(v2, zvector, sinpitch)));
              points.push(point);
            }
            point = vec32.add(vec32.create(), start, vec32.subtract(v1, vec32.scale(v1, prevcylinderpoint, cospitch), vec32.scale(v2, zvector, sinpitch)));
            points.push(point);
            polygons.push(fromPoints(points));
            points = [];
            point = vec32.add(vec32.create(), vec32.scale(v1, prevcylinderpoint, prevcospitch), vec32.scale(v2, zvector, prevsinpitch));
            vec32.add(point, point, end);
            points.push(point);
            point = vec32.add(vec32.create(), vec32.scale(v1, cylinderpoint, prevcospitch), vec32.scale(v2, zvector, prevsinpitch));
            vec32.add(point, point, end);
            points.push(point);
            if (slice2 < qsegments) {
              point = vec32.add(vec32.create(), vec32.scale(v1, cylinderpoint, cospitch), vec32.scale(v2, zvector, sinpitch));
              vec32.add(point, point, end);
              points.push(point);
            }
            point = vec32.add(vec32.create(), vec32.scale(v1, prevcylinderpoint, cospitch), vec32.scale(v2, zvector, sinpitch));
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
    let { center, radius, segments, axes } = Object.assign({}, defaults, options);
    if (!isGTE(radius, 0)) throw new Error("radius must be positive");
    radius = [radius, radius, radius];
    return ellipsoid({ center, radius, segments, axes });
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
  const getPoints = (vertices, radius, startAngle, center) => {
    const a = TAU / vertices;
    const points = [];
    for (let i = 0; i < vertices; i++) {
      const point = vec22.fromAngleRadians(vec22.create(), a * i + startAngle);
      vec22.scale(point, point, radius);
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
    if (clockwise === signedArea(data, start, end, dim) > 0) {
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
    let inside = false;
    const px = (a.x + b.x) / 2;
    const py = (a.y + b.y) / 2;
    do {
      if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) {
        inside = !inside;
      }
      p = p.next;
    } while (p !== a);
    return inside;
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
  const signedArea = (data, start, end, dim) => {
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
    const children = [];
    const parents = [];
    solids.forEach((s, i) => {
      const solid = outlines[s];
      children[i] = [];
      holes.forEach((h, j) => {
        const hole = outlines[h];
        if (arePointsInside([hole[0]], { vertices: solid })) {
          children[i].push(h);
          if (!parents[j]) parents[j] = [];
          parents[j].push(i);
        }
      });
    });
    holes.forEach((h, j) => {
      if (parents[j] && parents[j].length > 1) {
        const directParent = minIndex(parents[j], (p) => children[p].length);
        parents[j].forEach((p, i) => {
          if (i !== directParent) {
            children[p] = children[p].filter((c) => c !== h);
          }
        });
      }
    });
    return children.map((holes2, i) => ({
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
        const v2 = vec32.scale(vec32.create(), this.v, vector2[1]);
        const planeOrigin = vec32.scale(vec32.create(), plane2, plane2[3]);
        const v3 = vec32.add(v1, v1, planeOrigin);
        return vec32.add(v2, v2, v3);
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
        const v2 = vertexMap.get(key2);
        const distance = vec32.distance(v1, v2);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestReplacement = v2;
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
    const B = angles[1];
    const C = Math.PI - A - B;
    const c = 1;
    const a = c / Math.sin(C) * Math.sin(A);
    const b = c / Math.sin(C) * Math.sin(B);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveAAS = (values) => {
    const A = values[0];
    const B = values[1];
    const C = Math.PI + NEPS - A - B;
    if (C < NEPS) throw new Error("AAS triangles require angles that sum to PI");
    const a = values[2];
    const b = a / Math.sin(A) * Math.sin(B);
    const c = a / Math.sin(A) * Math.sin(C);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveASA = (values) => {
    const A = values[0];
    const B = values[2];
    const C = Math.PI + NEPS - A - B;
    if (C < NEPS) throw new Error("ASA triangles require angles that sum to PI");
    const c = values[1];
    const a = c / Math.sin(C) * Math.sin(A);
    const b = c / Math.sin(C) * Math.sin(B);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveSAS = (values) => {
    const c = values[0];
    const B = values[1];
    const a = values[2];
    const b = solveSideFromSAS(c, B, a);
    const A = solveAngleFromSSS(b, c, a);
    const C = Math.PI - A - B;
    return createTriangle(A, B, C, a, b, c);
  };
  const solveSSA = (values) => {
    const c = values[0];
    const a = values[1];
    const C = values[2];
    const A = Math.asin(a * Math.sin(C) / c);
    const B = Math.PI - A - C;
    const b = c / Math.sin(C) * Math.sin(B);
    return createTriangle(A, B, C, a, b, c);
  };
  const solveSSS = (lengths) => {
    const a = lengths[1];
    const b = lengths[2];
    const c = lengths[0];
    if (a + b <= c || b + c <= a || c + a <= b) {
      throw new Error("SSS triangle is incorrect, as the longest side is longer than the sum of the other sides");
    }
    const A = solveAngleFromSSS(b, c, a);
    const B = solveAngleFromSSS(c, a, b);
    const C = Math.PI - A - B;
    return createTriangle(A, B, C, a, b, c);
  };
  const createTriangle = (A, B, C, a, b, c) => {
    const p0 = vec22.fromValues(0, 0);
    const p1 = vec22.fromValues(c, 0);
    const p2 = vec22.fromValues(a, 0);
    vec22.add(p2, vec22.rotate(p2, p2, [0, 0], Math.PI - B), p1);
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
  const radiusToSegments = (radius, minimumLength, minimumAngle) => {
    const ss = minimumLength > 0 ? radius * TAU / minimumLength : 0;
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
    const points2D = points3D.map((v3) => {
      const x = Math.round(v3[0] / epsilon) * epsilon + 0;
      const y = Math.round(v3[1] / epsilon) * epsilon + 0;
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
      const v2 = vec32.scale(vec32.create(), this.v, point[1]);
      const v3 = vec32.add(v1, v1, this.planeorigin);
      const v4 = vec32.add(v2, v2, v3);
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
                  const v2 = line22.direction(prevpolygon.leftline);
                  const d1 = v1[0] - v2[0];
                  const v3 = line22.direction(thispolygon.rightline);
                  const v4 = line22.direction(prevpolygon.rightline);
                  const d2 = v3[0] - v4[0];
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
      let children = [this];
      const queue = [children];
      let i, j, l, node;
      for (i = 0; i < queue.length; ++i) {
        children = queue[i];
        for (j = 0, l = children.length; j < l; j++) {
          node = children[j];
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
      let children = [this];
      const queue = [children];
      let i, j, l, node;
      for (i = 0; i < queue.length; i++) {
        children = queue[i];
        for (j = 0, l = children.length; j < l; j++) {
          node = children[j];
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
      let children = [this];
      const queue = [children];
      for (let i = 0; i < queue.length; ++i) {
        children = queue[i];
        const l = children.length;
        for (let j = 0; j < l; j++) {
          const node = children[j];
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
      let children = [this];
      const queue = [children];
      let i, j, l, node;
      for (i = 0; i < queue.length; ++i) {
        children = queue[i];
        const prefix = " ".repeat(i);
        for (j = 0, l = children.length; j < l; j++) {
          node = children[j];
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
        const v2 = vertices[j + 1];
        const tetPolygons = createTetrahedronPolygons(apex, v0, v1, v2);
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
    const v2 = vec32.create();
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
        vec32.scale(v2, ybase, si * delta);
        vec32.add(v1, v1, v2);
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
      const zaxis = vec32.cross(v2, yaxis, xaxis);
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
      while (cnt > 1 && ccw(stack[cnt - 2], stack[cnt - 1], point.point) <= Number.EPSILON) {
        stack.pop();
        cnt = stack.length;
      }
      stack.push(point.point);
    });
    return stack;
  };
  const ccw = (v1, v2, v3) => (v2[0] - v1[0]) * (v3[1] - v1[1]) - (v2[1] - v1[1]) * (v3[0] - v1[0]);
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
    let v22 = opposite.next.v2;
    const angle1 = calculateAngle(v0, v12, v22, normal);
    v0 = opposite.prev.v1;
    v12 = opposite.prev.v2;
    v22 = current.next.v2;
    const angle2 = calculateAngle(v0, v12, v22, normal);
    return [angle1, angle2];
  };
  const v1 = vec32.create();
  const v2 = vec32.create();
  const calculateAngle = (prevpoint, point, nextpoint, normal) => {
    const d0 = vec32.subtract(v1, point, prevpoint);
    const d1 = vec32.subtract(v2, nextpoint, point);
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
  const populateRelativeToFromBounds = (relativeTo, modes, bounds) => {
    for (let i = 0; i < 3; i++) {
      if (relativeTo[i] == null) {
        if (modes[i] === "center") {
          relativeTo[i] = (bounds[0][i] + bounds[1][i]) / 2;
        } else if (modes[i] === "max") {
          relativeTo[i] = bounds[1][i];
        } else if (modes[i] === "min") {
          relativeTo[i] = bounds[0][i];
        }
      }
    }
    return relativeTo;
  };
  const alignGeometries = (geometry, modes, relativeTo) => {
    const bounds = measureAggregateBoundingBox(geometry);
    const translation = [0, 0, 0];
    for (let i = 0; i < 3; i++) {
      if (modes[i] === "center") {
        translation[i] = relativeTo[i] - (bounds[0][i] + bounds[1][i]) / 2;
      } else if (modes[i] === "max") {
        translation[i] = relativeTo[i] - bounds[1][i];
      } else if (modes[i] === "min") {
        translation[i] = relativeTo[i] - bounds[0][i];
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
      const bounds = measureAggregateBoundingBox(geometries2);
      relativeTo = populateRelativeToFromBounds(relativeTo, modes, bounds);
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
    const bounds = measureBoundingBox(object);
    const offset = [0, 0, 0];
    if (axes[0]) offset[0] = relativeTo[0] - (bounds[0][0] + (bounds[1][0] - bounds[0][0]) / 2);
    if (axes[1]) offset[1] = relativeTo[1] - (bounds[0][1] + (bounds[1][1] - bounds[0][1]) / 2);
    if (axes[2]) offset[2] = relativeTo[2] - (bounds[0][2] + (bounds[1][2] - bounds[0][2]) / 2);
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
export {
  commonjsGlobal as c,
  getDefaultExportFromCjs as g,
  requireSrc as r
};
