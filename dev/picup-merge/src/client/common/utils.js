var util = {};

util.arrayBufferToBase64Img = function ( buffer ) {
  let binary = '';
  let bytes = new Uint8Array( buffer );
  let len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return 'data:image/jpeg;base64,' + window.btoa( binary );
}

util.readUploadedFileAsDataURL = function (inputFile) {
  const temporaryFileReader = new FileReader();

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort();
      return reject(new DOMException("Problem parsing input file."));
    };

    temporaryFileReader.onload = () => {
      return resolve(temporaryFileReader.result);
    };
    temporaryFileReader.readAsDataURL(inputFile);
  });

};

util.dateFormatting = function (date) {
  var items = date.split('T');
  return items[0] + ' ' + items[1].substring(0, 8);
}

util.getResource = function (resourcePath) {
  return 'https://localhost/' + resourcePath;
}

util.extractRegion = function (googlemapdata) {
  var item = null
  console.log(googlemapdata);
  try {
    console.log('extractRegion try')
    var items = googlemapdata.plus_code.compound_code.split(' ');
    item = items[2];
    return item;
  }
  catch (e) {
    console.log(e);
    console.log('extractRegion catch');
    console.log(googlemapdata.results);
    var items = googlemapdata.results[0].formatted_address.split(' ');
    item = items[1];
    return item;
  }
}

util.birthFormatting = function (date) {
  var items = date.split('T');
  return items[0];
}

util.genderFormatting = function (gender) {
  return gender == 0 ? '남' : '여';
}

export default util;