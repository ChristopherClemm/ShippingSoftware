#include <iostream>
#include <nan.h>
using namespace v8;

void myFunc(){
  std::cout << "sup";
  long long count = 0;
  for (long long i = 0; i < 10000000000; i++) {
    count = i;
  }
  std::cout << count << "\n";
}

NAN_METHOD(hello) {

  int count = 0;
  for (int i = 0; i < 100000000; i++) {
    count = i;
  }
  myFunc();
  myFunc();
  myFunc();
  myFunc(); 
  std::cout << "hello2\n";
}

NAN_MODULE_INIT(init) {
  Nan::SetMethod(target, "hello", hello);
}

NODE_MODULE(hello, init);