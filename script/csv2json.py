import json
import csv
import codecs
import os


def unicode_csv_reader(utf8_data, dialect=csv.excel, **kwargs):
    csv_reader = csv.reader(utf8_data, dialect=dialect, **kwargs)
    for row in csv_reader:
        yield [unicode(cell, 'utf-8') for cell in row]


def csv2json(fin, fout):
    reader = unicode_csv_reader(open(fin), delimiter='\t')
    arr = []
    reader.next()
    for seq, postal, id, district, name, number, latitude, longitude in reader:
        if not latitude:
            continue

        obj = {}
        obj['id'] = id
        obj['district'] = district
        obj['name'] = name
        obj['number'] = number
        obj['latitude'] = latitude
        obj['longitude'] = longitude
        arr.append(obj)

    with codecs.open(fout, 'w', 'utf-8') as fo:
        fo.write(json.dumps(arr))

if __name__ == '__main__':
    csv2json(
        'public-wifi.txt',
        os.path.abspath(os.path.join('../data/wifi/', 'map.json'))
    )
