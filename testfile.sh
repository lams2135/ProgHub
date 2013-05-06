# $1 = upid
# $2 = fname
# $3 = tid

mkdir upload/hw/$1
mv $2 upload/hw/$1/src.zip
cp upload/hwtest/$3/test.zip upload/hw/$1/test.zip
cd upload/hw/$1
mkdir tmp
cp src.zip tmp/src.zip
mv test.zip tmp/test.zip
cd tmp
unzip src.zip
unzip -o test.zip

# handle the system() in src-file.
sh test.sh

cd ..
cp tmp/res.txt output.txt
cp tmp/res.out res.txt
rm -rf tmp

exit
