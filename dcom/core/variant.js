let ErrorCodes;
let System;
let HashMap;
let Flags;
let ComString;
let ComArray;
let ComObject;
let ComObjectImpl;
let types;
let ComValue;
let MarshalUnMarshalHelper;
let Pointer;
let inited;

const EMPTY = {};
const NULL = {};
const SCODE = {};

class Variant {

  /**
   * 
   * @param {ComValue} [value]
   * @param {boolean} [isByRef]
   */
  constructor(value, isByRef, FLAG)
  {
    this._init();
    if (value) {
      switch(value.getType()){
        case types.INTEGER:
        case types.FLOAT:
        case types.LONG:
        case types.DOUBLE:
        case types.SHORT:
          this.init(new Number(value.getValue()), isByref? isByRef : false);
        case types.BOOLEAN:
          this.init(new Boolean(value.getValue()), isByref? isByRef : false);
        case types.CHARACTER:
          this.init(new ComString(value.getValue(), Flags.FLAG_REPRESENTATION_STRING_BSTR), isByref? isByRef : false);
        case types.STRING:
          this.init(new ComString(value.getValue(), Flags.FLAG_REPRESENTATION_STRING_BSTR), isByref? isByRef : false);
        case types.COMSTRING:
          this.init(value.getValue(), isByref? isByRef : false);
        case types.COMOBJECT:
          this.init(value.getValue(), isByRef? isByRef : false);
          // TO-DO: if IDispatch com is desired it must be implemented here to set the correct flag
        case types.DATE:
          this.init(value.getValue(), isByRef? isByRef : false);
        case types.CURRENCY:
          this.init(value.getValue(), isByRef? isByRef : false);
        case types.COMARRAY:
          this.initArrays(value.getValue(), isByref? isByRef : false, FLAG? FLAG : Flags.FLAG_NULL);
      }
    }

    this.EMPTY = {};
    this.EMPTY_BYREF = this.EMPTY; // TO-DO; maybe it should be Variant
    this.NULL = {};
    this.OPTIONAL_PARAM = {};
    this.SCODE = SCODE;
    this.member = null;

    this.serialVersionUUID = "5101290038004040628L;"
    this.VT_NULL 			   = 0x00000001;
  	this.VT_EMPTY 			 = 0x00000000;
  	this.VT_I4 				   = 0x00000003;
  	this.VT_UI1				   = 0x00000011;
  	this.VT_I2 				   = 0x00000002;
  	this.VT_R4 				   = 0x00000004;
  	this.VT_R8 				   = 0x00000005;
  	this.VT_VARIANT			 = 0x0000000c;
  	this.VT_BOOL 			   = 0x0000000b;
  	this.VT_ERROR 			 = 0x0000000a;
  	this.VT_CY 				   = 0x00000006;
  	this.VT_DATE 			   = 0x00000007;
  	this.VT_BSTR 			   = 0x00000008;
  	this.VT_UNKNOWN 		 = 0x0000000d;
  	this.VT_DECIMAL 		 = 0x0000000e;
  	this.VT_DISPATCH 		 = 0x00000009;
  	this.VT_ARRAY			   = 0x00002000;
  	this.VT_BYREF  			 = 0x00004000;
  	this.VT_BYREF_VT_UI1 = this.VT_BYREF|this.VT_UI1;//0x00004011;
  	this.VT_BYREF_VT_I2  = this.VT_BYREF|this.VT_I2;//0x00004002;
  	this.VT_BYREF_VT_I4  = this.VT_BYREF|this.VT_I4;//0x00004003;
  	this.VT_BYREF_VT_R4  = this.VT_BYREF|this.VT_R4;//0x00004004;
  	this.VT_BYREF_VT_R8  = this.VT_BYREF|this.VT_R8;//0x00004005;
  	this.VT_BYREF_VT_BOOL 	  = this.VT_BYREF|this.VT_BOOL;//0x0000400b;
  	this.VT_BYREF_VT_ERROR 	  = this.VT_BYREF|this.VT_ERROR;//0x0000400a;
  	this.VT_BYREF_VT_CY 	 	  = this.VT_BYREF|this.VT_CY;//0x00004006;
  	this.VT_BYREF_VT_DATE 	  = this.VT_BYREF|this.VT_DATE;//0x00004007;
  	this.VT_BYREF_VT_BSTR 	  = this.VT_BYREF|this.VT_BSTR;//0x00004008;
  	this.VT_BYREF_VT_UNKNOWN  = this.VT_BYREF|this.VT_UNKNOWN;//0x0000400d;
  	this.VT_BYREF_VT_DISPATCH = this.VT_BYREF|this.VT_DISPATCH;//0x00004009;
  	this.VT_BYREF_VT_ARRAY 	  = this.VT_BYREF|this.VT_ARRAY;//0x00006000;
  	this.VT_BYREF_VT_VARIANT  = this.VT_BYREF|this.VT_VARIANT;//0x0000400c;

  	this.VT_I1 				 = 0x00000010;
  	this.VT_UI2 			 = 0x00000012;
  	this.VT_UI4 			 = 0x00000013;
  	this.VT_I8				 = 0x00000014;
  	this.VT_INT 			 = 0x00000016;
  	this.VT_UINT 			 = 0x00000017;
  	this.VT_BYREF_VT_DECIMAL  = this.VT_BYREF|this.VT_DECIMAL;//0x0000400e;
  	this.VT_BYREF_VT_I1  	 	  = this.VT_BYREF|this.VT_I1;//0x00004010;
  	this.VT_BYREF_VT_UI2 	 = this.VT_BYREF|this.VT_UI2;//0x00004012;
  	this.VT_BYREF_VT_UI4 	 = this.VT_BYREF|this.VT_UI4;//0x00004013;
  	this.VT_BYREF_VT_I8		 = this.VT_BYREF|this.VT_I8;//0x00004014;
  	this.VT_BYREF_VT_INT 	 = this.VT_BYREF|this.VT_INT;//0x00004016;
  	this.VT_BYREF_VT_UINT  = this.VT_BYREF|this.VT_UINT;//0x00004017;

  	this.FADF_AUTO       = 0x0001;  /* array is allocated on the stack */
  	this.FADF_STATIC     = 0x0002;  /* array is staticly allocated */
  	this.FADF_EMBEDDED   = 0x0004;  /* array is embedded in a structure */
  	this.FADF_FIXEDSIZE  = 0x0010;  /* may not be resized or reallocated */
  	this.FADF_RECORD     = 0x0020;  /* an array of records */
  	this.FADF_HAVEIID    = 0x0040;  /* with FADF_DISPATCH, FADF_UNKNOWN */
  	                                        /* array has an IID for interfaces */
  	this.FADF_HAVEVARTYPE = 0x0080;  /* array has a VT type */
  	this.FADF_BSTR        = 0x0100;  /* an array of BSTRs */
  	this.FADF_UNKNOWN     = 0x0200;  /* an array of IUnknown* */
  	this.FADF_DISPATCH    = 0x0400;  /* an array of IDispatch* */
  	this.FADF_VARIANT     = 0x0800;  /* an array of VARIANTs */
    this.FADF_RESERVED    = 0xF008; /* reserved bits */

    this.supportedTypes = new HashMap();
    this.supportedTypes_classes = new HashMap();
    this.outTypeMap = new HashMap();

    // populate those hashes
    this.outTypeMap.set(Number, new Number(0));
    this.outTypeMap.set(Boolean, false);
    this.outTypeMap.set(String, "");
    // TO-DO: find a way to do this.outTypeMap.set(Currency, new Currency("0.0"));
    this.outTypeMap.set(Date, new Date());

    // TO-DO: evaluate the necessity of unsigned byte, short, and integer (all Number here)
    // TO-DO: same for long, which would require an external module since no suport in JS

    this.supportedTypes.set(Object, new Number(this.VT_VARIANT));
    this.supportedTypes.set(Variant, new Number(this.VT_VARIANT));
    this.supportedTypes.set(Boolean, new Number(this.VT_BOOL));
    this.supportedTypes.set(ComString, new Number(this.VT_BSTR));
    this.supportedTypes.set(EMPTY, new Number(this.VT_EMPTY));
    this.supportedTypes.set(SCODE, new Number(this.VT_ERROR));
    this.supportedTypes.set(NULL, new Number(this.VT_NULL));
    this.supportedTypes.set(Array, new Number(this.VT_ARRAY));
    this.supportedTypes.set(Date, new Number(this.VT_DATE));
    // TO-DO: find a way to dothis.supportedTypes(Currency, new Number(this.VT_CY));

    // TO-DO: evaluate what should be done with the missing types
    // and if it will impact on the lib when interacting with a COM server
    this.supportedTypes_classes.set(new Number(this.VT_DATE), Date);
    // TO-DO: find a way to do this.supportedTypes_classes(new Number(this.VT_CY), Currency);
    this.supportedTypes_classes.set(new Number(this.VT_VARIANT), Variant);
    this.supportedTypes_classes.set(new Number(this.VT_I4), Number);
    this.supportedTypes_classes.set(new Number(this.VT_INT), Number);
    this.supportedTypes_classes.set(new Number(this.VT_R4), Number);
    this.supportedTypes_classes.set(new Number(this.VT_BOOL), Boolean);
    this.supportedTypes_classes.set(new Number(this.VT_I2), Number);
    this.supportedTypes_classes.set(new Number(this.VT_I1), String);
    this.supportedTypes_classes.set(new Number(this.VT_BSTR), String);
    this.supportedTypes_classes.set(new Number(this.VT_ERROR), SCODE);
    this.supportedTypes_classes.set(new Number(this.VT_EMPTY), EMPTY);
    this.supportedTypes_classes.set(new Number(this.VT_NULL), NULL);
    this.supportedTypes_classes.set(new Number(this.VT_ARRAY), Array);
    this.supportedTypes_classes.set(new Number(this.VT_UNKNOWN), ComObject);
    this.supportedTypes_classes.set(new Number(this.VT_DISPATCH), ComObject);

    // init Arrays
    this.arryInits = new Array();
    this.arryInits.push(ComString);
    this.arryInits.push(Pointer);
    this.arryInits.push(ComObjectImpl);
    // TO-DO: if IDispatch support is desired: this.arryInits.push(Dispatch);
    // this.arryInits.push(Unknown);
    this.arryInits.push(ComObject);
  }

  _init(){
    if (inited) return;
    ErrorCodes = require('../common/errorcodes.js');
    System = require('../common/system.js');
    HashMap = require('hashmap');
    Flags = require('./flags.js');
    ComString = require('./string');
    ComArray = require('./comarray');
    ComObject = require('./comobject');
    ComObjectImpl = require('./comobjcimpl');
    types = require('./types');
    ComValue = require('./comvalue');
    MarshalUnMarshalHelper = require('./marshalunmarshalhelper');
    Pointer = require('./pointer');
    inited = true;
  }

  OUTPARAMforType(c, isArray)
  {
    var variant = null;
    if (!isArray) {
      variant = this.makeVariant(outTypeMap.get(c), true);

      if (c instanceof Dispatch) {
        return this.OUT_DISPATCH();
      } else if (c instanceof ComObject) {
        return this.OUT_UNKNOWN();
      } else if (c instanceof Variant) {
        return this.EMPTY_BYREF();
      } else if (c instanceof String) {
        return new Variant("", true);
      }
    } else {
      var oo = this.outTypeMap.get(c);
      if (oo != null) {
        var x = new Array(1);
        x[0] = oo;
        variant = new Variant(new IArray(x, true), true);
      }

      if (c instanceof Dispatch) {
        var arry = [new ComObjectImpl(null, new InterfacePointer(null, -1, null))];
        variant = new Variant(new IArray(arry, true), true);
        variant.setFlag(Flags.FLAG_REPRESENTATION_DISPATCH_NULL_FOR_OUT |
          Flags.FLAG_REPRESENTATION_SET_INTERFACEPTR_NULL_FOR_VARIANT);
      } else if (c instanceof ComObject) {
        var arry = [new ComObjectImpl(null, new InterfacePointer(null, -1, null))];
        variant = new Variant(new IArray(arry, true), true);
        variant.setFlag(FLags.FLAG_REPRESENTATION_UNKNOWN_NULL_FOR_OUT |
          Flags.FLAG_REPRESENTATION_SET_INTERFACEPTR_NULL_FOR_VARIANT);
      } else if (c instanceof Variant) {
        return VARIANTARRAY();
      } else if (c instanceof IString || c instanceof String) {
        return BSTRARRAY();
      }
    }
    return variant;
  }

  makeVariant(o, isByref)
  {
    isByref = (isByref == undefined) ? false : isByref;

    if (o == null || o instanceof Object) {
      if (isByref) {
        return Variant.EMPTY_BYREF();
      } else {
        return Variant.EMPTY();
      }
    }

    var c  = typeof o;
    if (c instanceof Array) {
      throw new Error("Illegal Argument.");
    }

    if (c instanceof Variant) {
      return new Variant(o);
    }

    // here is the catch, on j-interop they use reflections and
    // heavly use function overloading. Since JS do not support function overloading
    // this piece of code is sipmlified. If any problem arises, remember to check
    // if the problem isnt here
    try {
      return new Variant(o, isByref);
    } catch (e){}

    return null;
  }

  getSupportedClass(type)
  {
    return this.supportedTypes_classes.get(type);
  }

  getSupportedType(c, FLAG)
  {
    var retVal = this.supportedTypes.get(c);

    if (retVal == null && c instanceof ComObject) {
      retVal = new Number(this.VT_UNKNOWN);
    }

    if (retVal == null && c instanceof Dispatch) {
      retVal = new Number(this.VT_DISPATCH);
    }

    if (retVl == this.VT_I4 && (FLAG & Flags.FLAG_REPRESENTATION_VT_INT) ==
      Flags.FLAG_REPRESENTATION_VT_INT) {
      retVal = new Number(this.VT_INT);
    } else if (retVal == this.VT_UI4 &&
      (FLAG & Flags.FLAG_REPRESENTATION_VT_UINT) == Flags.FLAG_REPRESENTATION_VT_UINT) {
      retVal = new Number(this.VT_UINT);
    }

    return retVal;
  }

  getSupportedTypeObj(o, defaultType)
  {
    var c = o.constructor;
    var retVal = this.supportedTypes.get(c);

    if (retVal == null && o instanceof Dispatch) {
      retval = new Number(this.VT_DISPATCH);
    }

    if (retVal == null && o instanceof ComObject) {
      retval = new Number(this.VT_UNKNOWN);
    }

    return retval;
  }

  EMPTY()
  {
    return new Variant(new EMPTY());
  }

  EMPTY_BYREF()
  {
    return new Variant(this.EMPTY());
  }

  OUT_UNKNOWN()
  {
    var retVal = new Variant(new ComObjectImpl(null, new InterfacePointer(null, -1, null)), true);
    retval.setFlag(Flags.FLAG_REPRESENTATION_UNKNOWN_NULL_FOR_OUT |
      Flags.FLAG_REPRESENTATION_SET_INTERFACEPTR_NULL_FOR_VARIANT);
      return retval;
  }

  OUT_DISPATCH()
  {
    var retVal = new Variant(new ComObjectImpl(null, new InterfacePointer(null, -1, null)), true);
    retVal.setFlag(Flags.FLAG_REPRESENTATION_DISPATCH_NULL_FOR_OUT |
      FLags.FLAG_REPRESENTATION_SET_INTERFACEPTR_NULL_FOR_VARIANT);
    return retval;
  }

  NULL()
  {
    return new Variant(new NULL());
  }

  OPTIONAL_PARAM()
  {
    return new Variant(Variant.SCODE, ErrorCodes.DISP_E_PARAMNOTFOUND);
  }

  BSTRARRAY()
  {
    return new Variant(new IArray([""], true), true);
  }

  VARIANTARRAY()
  {
    return new Variant(new IArray([Variant.EMPTY()], true), true);
  }

  init(obj, isByref)
  {
    isByref = (isByref == undefined) ? false : isByref;

    if (obj != null && obj instanceof Array) {
      throw new Error("Ilegal Argument: " + ErrorCodes.VARIANT_ONLY_JIARRAY_EXCEPTED);
    }

    if (obj != null && obj instanceof InterfacePointer) {
      throw new Error("Ilegal Argument:" + ErrorCodes.VARIANT_TYPE_INCORRECT);
    }

    if (obj instanceof VariantBody) {
      this.member = new Pointer(obj);
    }else {
      var variantBody = new VariantBody(obj, isByref);
      this.member = new Pointer(variantBody);
    }
    this.member.setReferent(0x72657355);
  }

  setDeffered(deffered)
  {
    if (this.member != null && !this.member.getValue().isReference()) {
      this.member.getValue().setDeferred(deffered);
    }
  }

  setFlag(FLAG)
  {
    var variantBody = this.member.getReferent();
    variantBody.FLAG |= FLAG;
  }

  getFlag()
  {
    var variantBody = this.member.getReferent();
    return variantBody.FLAG;
  }

  isNull()
  {
    if (this.member == null) {
      return true;
    }
    var variantBody = this.member.getReferent();
    return variantBody == null ? true : variantBody.isNull();
  }

  functions(fs)
  {
    var self = {};
    fs.forEach(function(f){
      self[f.length] = f
    });
    return function(){
      self[arguments.length].apply(this, arguments);
    };
  }

  Variant(){
    this.functions([

    ]);
  }

  VariantValBool(value, isByref, errorCode){
    isByref = (isByref == undefined) ? false : isByref;
    errorCode = (erroCode == undefined) ? false: errorCode;

    if (value instanceof Number)
    {
      this.init(new Number(value), isByref);
    }
    else if (value instanceof Boolean)
    {
      this.init(new Boolean(value), isByref);
    }
    else if (value instanceof IString)
     {
      this.init(value, isByref);
    }
    else if (value instanceof String)
     {
      this.init(new IString(value), isByref);
    }
    else if (value instanceof Date)
    {
      this.init(value, isByref);
    }
    else if (value instanceof Currency)
    {
      this.init(value, isByref);
    }
    else if (value instanceof SCODE)
    {
      this.init(new VariantBody(VariantBody.SCODE, errorCode, false));
    }
    else if (value instanceof EMPTY)
    {
      this.init(null);
    }
    else if (value instanceof NULL)
    {
      this.init(new VariantBody(VariantBody.NULL));
    }
    else if (value instanceof ComObject)
    {
      this.init(value, isByref);
      if (value instanceof Dispatch) {
        this.setFlag(Flags.FLAG_REPRESENTATION_USE_DISPATCH_IID);
      } else {
        this.setFlag(Flags.FLAG_REPRESENTATION_UNKNOWN_IID);
      }
    }
  }

  VariantArray(array, isByref, FLAG)
  {
    isByref = (isByref == undefined) ? false : isByref;
    FLAG = (FLAG == undefined) ? Flags.FLAG_NULL : FLAG;
    this.initArrays(array, isByref, FLAG);
  }


  //TO-DO: this will take some time, postpone it until it is needed
  initArrays(array, isByref, FLAG)
  {
    var variant2 = null;
    var array2 = null;
    var c= NULL;
    var newArrayObj = null;
    var is2Dim = false;

    if (array == null) {
      this.init(null, false);
      return;
    }

    var dimension = 1;
    if (array.length == 1 && (array[0] instanceof Array)) {
      dimension = 2;
    }

    switch (array.length) {
      case 1:
        var obj = array.getArrayInstance();
        newArrayObj = obj;
        c = obj[0].constructor;
        break;
      case 2:
        var obj2 = array.getArrayInstance();

        var name = typeof obj2[0][0].constructor;
        var subArray = obj2;
        name = name.substring(1);
        break;
      default:
    }
  }

  getObject()
  {
    this.checkValidity();
    return (this.member.getReferent());
  }

  getObjectAsInt(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsInt();
  }

  getObjectAsFloat(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsFloat();
  }

  getObjectAsCODE(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsCODE();
  }

  getObjectAsDouble(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsDouble();
  }

  getObjectAsShort(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsShort();
  }

  getObjectAsBoolean(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsBoolean();
  }

  getObjectAsString(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsString();
  }

  //TO-DO: asString2

  getObjectAsDate(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsDate();
  }

  getObjectAsComObject(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsComObject();
  }

  getObjectAsVariant(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsVariant();
  }

  getObjectAsArray(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsArray();
  }

  getObjectAsLong(){
    this.checkValidity();
    return (this.member.getReferent()).getObjectAsLong();
  }

  encode(ndr, defferedPointers, FLAG)
  {
    this.member.setDeferred(true);
    //TO-DO: serializing
  }

  decode(ndr, defferedPointers, FLAG, addionalData)
  {
    var variant = new Variant();
    var ref = new Pointer(new ComValue(null, types.VARIANTBODY));
    ref.setDeffered(true);
    variant.member = MarshalUnMarshalHelper.deSerialize(ndr, new ComValue(ref, types.POINTER), defferedPointers, FLAG, addionalData);
    return new ComValue(variant, types.VARIANT);
  }

  isArray()
  {
    this.checkValidity;
    return (this.member.getReferent()).isArray();
  }

  getLengthInBytes(FLAG)
  {
    this.checkValidity();
    //// TODO: MARSHALING GET LENGTH IN BYTES
  }

  isByRefFlagSet()
  {
    this.checkValidity();
    return (this.member.getReferent()).isByref();
  }

  getType()
  {
    this.checkValidity();
    return (this.member.getReferent()).getType();
  }

  checkValidity()
  {
    if (this.member == null || this.member.isNull()) {
      throw new Error(ErrorCodes.VARIANT_IS_NULL);
    }
  }

  toString()
  {
    return this.member == null ? "[null]" : String('[' + this.member.toString() + ']');
  }
};

class VariantBody
{
  constructor(constructor,args)
  {
    this.serialVersionUID = -8484108480626831102;
  	this.VT_PTR = 0x1A;
  	this.VT_SAFEARRAY = 0x1B;
  	this.VT_CARRAY = 0x1C;
    this.VT_USERDEFINED = 0x1D;

    this.EMPTY = EMPTY;
    this.NULL = NULL;
    this.SCODE = SCODE;

    this.is2Dimensional = false;
    this.obj = null;
    this.type = -1;
    this.safeArrayStruct = null;
    this.isArray = false;
    this.isScode = false;
    this.isNUll = false;
    this.nestedArrayRealClass = null;
    this.type3 = new Array();
    this.isByref = false;
    this.FLAG = Flags.FLAG_NULL;

    // easier workaround for lack of function overloading
    if (constructor == 1) {
      VariantBodyObj(args);
    } else if (constructor == 2) {
      VariantBodyValue(args);
    } else if (constructor == 3) {
      VariantBodyArray(args);
    }

    // populate type3
    this.type3.push(Number);
    this.type3.push(Boolean);
    this.type3.push(String);
    this.type3.push(EMPTY);
    this.type3.push(NULL);
    this.type3.push(SCODE);
  }

  VariantBodyObj(args){
    var dataType = (args.dataType == undefined) ? -1 : args.DataType;

    this.obj = (args.referent == null) ? VariantBody.EMPTY : args.referent;

    if (obj instanceof IString && (obj.getType() != Flags.FLAG_REPRESENTATION_STRING_BSTR)) {
      throw new Error(ErrorCodes.VARIANT_BSTR_ONLY);
    }

    if (obj instanceof Boolean) {
      this.FLAG = Flags.FLAG_REPRESENTATION_VARIANT_BOOL;
    }

    this.isByref = args.isByRef;

    var types = Variant.getSupportedTypes(obj, dataType);
    if (types != null) {
      this.type = Number.parseInt(types) | (args.isByRef ? Variant.VT_BYREF:0);
    } else {
      throw new Error(ErrorCodes.VARIANT_UNSUPPORTED_TYPE);
    }

    if (dataType == Variant.VT_NULL) {
      this.isNull = true;
      obj = new Number(0);
    }
  }

  VariantBodyValue(args)
  {
    if (args.value instanceof NULL) {
      this.VariantBodyObj(new Number(0), false);
      this.isNull = true;
      this.type = Varian.VT_NULL;
    }

    this.VariantBodyObj(new Integer(args.errorCode), args.isByRef);
    this.isScode = true;
    this.type = Variant.VT_ERROR;
  }

  VariantBodyArray(args)
  {
    this.FLAG = args.FLAG;
    this.safeArrayStruct = args.safeArray;
    this.isArray = true;
    if (this.safeArrayStruct == null) {
      this.isNull = true;

    }

    this.nestedArrayRealClass = args.nestedClass;
    this.is2Dimensional = args.is2Dimensional;

    this.isByRef = args.isByRef;

    var types = Number.parseInt(Variant.getSupportedType(args.nestedClass, FLAG));
    if (types != null) {
      this.type = types | (args.isByRef ? Variant.VT_BYREF:0);
    } else {
      throw new Error(ErrorCodes.VARIANT_UNSUPPORTED_TYPE);
    }
  }

  getObject()
  {
    return (this.obj == null) ? this.getArray() : this.obj;
  }

  getArray()
  {
    var retVal = null;

    if (this.safeArrayStruct != null) {
      retVal = this.safeArrayStruct.getMember(7).getReferent();

      if (this.is2Dimensional) {
        var obj3 = retVal.getArrayInstance();
        var safeArrayBound = this.safeArrayStruct.getMember(8);

        // TODO: IMPLEMENT THE REST WITH BI-DIMENSIONAL Array
        // IM POSTPONING THIS FOR NOW BUT IT WILL BE NEEDED LATER
      }
    }
  }

  getObjectAsInt()
  {
    try {
      return Number.parseInt(this.obj);
    }catch(e){};
  }

  getObjectAsLong()
  {
    try {
      return Number.parseInt(this.obj);
    }catch(e){};
  }

  getObjectAsSCODE()
  {
    try {
      return this.obj.erroCode;
    }catch(e){};
  }

  getObjectAsFloat()
  {
    try {
      return Number(this.obj);
    }catch(e){};
  }

  getObjectAsDouble()
  {
    try {
      return Number(this.obj);
    }catch(e){};
  }

  getObjectAsShort()
  {
    try {
      return Number.parseInt(this.obj);
    }catch(e){};
  }

  getObjectAsBoolean()
  {
    try {
      return Boolean(this.obj);
    }catch(e){};
  }

  getObjectAsString()
  {
    try {
      return String(this.obj);
    }catch(e){};
  }

  getObjectAsDate()
  {
    try {
      return Date(this.obj);
    }catch(e){};
  }

  getObjectAsVariant()
  {
    try {
      return Variant(this.obj);
    }catch(e){};
  }

  getObjectAsComObject()
  {
    try {
      return ComObject(this.obj);
    }catch(e){};
  }

  encode(ndr, defferedPointers, FLAG)
  {
    this.FLAG |= FLAG;
    var index = new Number(ndr.getBuffer().getIndex());
    if (index%8.0 != 0) {
      var i = (i=Math.round(index%8.0)) == 0 ? 0 : 8 - i;
      ndr.writeOctetArray(new Array[Number.parseInt(i)], 0, Number.parseInt(i));
    }

    var start = ndr.getBuffer.getIndex();

    ndr.writeUnsignedLong(0xFFFFFFFF);
    ndr.writeUnsignedLong(0);

    var varType = this.getVarType(obj != null ? obj.constructor : this.nestedArrayRealClass, obj);

    if ((FLAG & FLags.FLAG_REPRESENTATION_DISPATCH_NULL_FOR_OUT) ==
      Flags.FLAG_REPRESENTATION_DISPATCH_NULL_FOR_OUT) {
      varType = isByRef ? 0x4000 | Variant.VT_DISPATCH : Variant.VT_DISPATCH;
    }

    ndr.writeUnsignedShort(varType);

    ndr.writeUnsignedSmall(0xCC);
		ndr.writeUnsignedSmall(0xCC);
		ndr.writeUnsignedSmall(0xCC);
		ndr.writeUnsignedSmall(0xCC);
		ndr.writeUnsignedSmall(0xCC);
    ndr.writeUnsignedSmall(0xCC);

    if (obj != null) {
      ndr.writeUnsignedLong(varType);
    } else {
      if (!isByRef) {
        ndr.writeUnsignedLong(new Variant()VT_ARRAY);
      } else {
        ndr.writeUnsignedLong(new Variant()VT_BYREF_VT_ARRAY);
      }
    }

    if (isByRef) {
      var flag = -1;
      if (this.isArray) {
        flag = -4;
      } else {
        switch (this.type) {
          case Variant.VT_BYREF_VT_VARIANT:
            flag = 0x10;
            break;
          case VT_BYREF_VT_DATE:
          case VT_BYREF_VT_CY:
            flag = 8;
            break;
          default:
            flag = 4;
        }
      }
      ndr.writeUnsignedLong(flag);
    }

    var varDefferedPointers = new Array();

    this.setValue(ndr, obj, varDefferedPointers, FLAG);

    var x = 0;
    while (x < varDefferedPointers.length) {
      var newList = new Array();
      MarshalUnMarshalHelper.serialize(ndr, Pointer, varDefferedPointers[x],
        newList, FLAG);
      x++;
      var aux = newList.slice(0, newList.length);
      var aux_i = x;
      while (aux.length > 0) {
        varDefferedPointers.splice(x, 0, aux.shift());
      }
    }

    var currentIndex = 0;
    var length = (currentIndex = ndr.getBuffer(0).getIndex()) - start;
    var value = Number.parseInt(length/8);
    if (length%8.0 != 0) {
      value++;
    }

    ndr.getBuffer().setIndex(start);
    ndr.writeUnsignedLong(value);
    ndr.getBuffer().setIndex(currentIndex);
  }

  getMaxLength(c, obj)
  {
    var length = 0;
    if (type3.includes(c)) {
      length = MarshalUnMarshalHelper.getLengthInBytes(c, obj, FLAG);
    } else if (c instanceof Number || c instanceof Date || c instanceof Currency) {
      length = 8;
    } else if (c instanceof IString) {
      length = MarshalUnMarshalHelper.getLengthInBytes(c, obj, FLAG);
    } else if (obj instanceof ComObject) {
      var value = obj.internal_getInterfacePointer().getLength();
      value = value + 4 + 4 + 4;
    }

    return length;
  }

  decode(ndr, defferedPointers, FLAG, additionalData){
		let index = new Integer(ndr.getBuffer().getIndex()).doubleValue();
		if (index % 8.0 != 0)
		{
			let i = (i=Math.round(index%8.0)) == 0 ? 0 : 8 - i ;
			ndr.readOctetArray(new Array(i), 0, i);
		}

		let start = ndr.getBuffer().getIndex();
		let length = ndr.readUnsignedLong(); //read the potential length
		ndr.readUnsignedLong(); //read the reserved byte

		let variantType = ndr.readUnsignedShort(); //varType

		//read reserved bytes
		ndr.readUnsignedShort();
		ndr.readUnsignedShort();
		ndr.readUnsignedShort();

		ndr.readUnsignedLong(); //32 bit varType

		let variant = null;

		let varDefferedPointers = new Array();
		if((variantType & new Variant().VT_ARRAY) == 0x2000)
		{
			let isByRef = (variantType & new Variant().VT_BYREF) == 0 ? false : true;
			//the struct may be null if the array has nothing
			let safeArray = this.getDecodedValueAsArray(ndr,varDefferedPointers,variantType & ~new Variant().VT_ARRAY,isByRef,additionalData,FLAG);
			let type2 = variantType;
			if (isByRef)
			{
				type2 = type2 & ~new Variant().VT_BYREF; //so that actual type can be determined
			}

			type2 = type2 & 0x0FFF ;
			let flagofFlags = FLAG;
			if (type2 == new Variant().VT_INT)
			{
				flagofFlags |= Flags.FLAG_REPRESENTATION_VT_INT;
			}
			else
			if (type2 == new Variant().VT_UINT)
			{
				flagofFlags |= Flags.FLAG_REPRESENTATION_VT_UINT;
			}
			else
			if (type2 == new Variant().VT_BOOL)
			{
				FLAG = flagofFlags |= Flags.FLAG_REPRESENTATION_VARIANT_BOOL;
			}

			if(safeArray != null)
			{
        variant = new VariantBody(safeArray, new Variant().getSupportedClass(new Number(type2 
          & ~new Variant().VT_ARRAY)),(safeArray.getMember(8)).getArrayInstance()).length > 1 ? true : false,isByRef,flagofFlags);
			}
			else
			{
				variant = new VariantBody(null, new Variant().getSupportedClass(new Number(type2 & ~new Variant().VT_ARRAY)),false,isByRef,flagofFlags);
			}

			variant.FLAG = flagofFlags;

		}
		else
		{
			let isByRef = (variantType & new Variant().VT_BYREF) == 0 ? false : true;
			variant = new VariantBody(getDecodedValue(ndr,varDefferedPointers,variantType,isByRef,additionalData,FLAG),isByRef,variantType);
			int type2 = variantType & 0x0FFF ;
			if (type2 == new Variant().VT_INT)
			{
				variant.FLAG = Flags.FLAG_REPRESENTATION_VT_INT;
			}
			else
			if (type2 == new Variant().VT_UINT)
			{
				variant.FLAG = Flags.FLAG_REPRESENTATION_VT_UINT;
			}
		}


		int x = 0;
		while (x < varDefferedPointers.size())
		{

			let newList = new Array();
			let replacement = MarshalUnMarshalHelper.deSerialize(ndr,new ComValue(varDefferedPointers.[x], types.POINTER),newList,FLAG,additionalData);
			varDefferedPointers[x].replaceSelfWithNewPointer(replacement); //this should replace the value in the original place.
			x++;
			varDefferedPointers.addAll(x,newList);
		}

		if (variant.isArray && variant.safeArrayStruct != null)
		{
			//SafeArray have the alignment rule , that all Size <=4 are aligned by 4 and size 8 is aligned by 8.
			//Variant is aligned by 4, Interface pointers are aligned by 4 as well.
			//but this should not exceed the length
			index = new Integer(ndr.getBuffer().getIndex()).doubleValue();
			length = length * 8 + start;
			if (index < length) {
				let safeArrayStruct = variant.safeArrayStruct;
				let size = safeArrayStruct.getMember(2);
				let i = 0;
				if (size.intValue() == 8) {
					if (index%8.0 != 0) {
						i = (i=Math.round(index%8.0)) == 0 ? 0 : 8 - i ;
						if (index + i <= length) {
							ndr.readOctetArray(new Array(i), 0, i);
						}	else {
							ndr.readOctetArray(new Array(length - index), 0, (length - index));
						}
					}
				}	else {
					//align by 4...
					//TODO this needs to be tested for Structs and Unions.
					if (index%4.0 != 0) {
						i = (i=Math.round(index%4.0)) == 0 ? 0 : 4 - i ;
						if (index + i <= length) {
							ndr.readOctetArray(new Array(i), 0, i);
						} else {
							ndr.readOctetArray(new Array(length - index), 0, (length - index));
						}
					}
				}
			}

			//SafeArray is complete
			let array = null;
			try {
				array = variant.getArray();
			} catch (e) {
				throw new Error(e);
			}
			let variantMain = new Variant(array,variant.isByRef,variant.FLAG);
			variant = variantMain.member.getValue().getReferent();
		}

		return variant;
  }
}

module.exports = {
  Variant,
  VariantBody
}
