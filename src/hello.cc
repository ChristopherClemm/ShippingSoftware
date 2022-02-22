#include <iostream>
#include <nan.h>
using namespace v8;

void myFunc(){
  std::cout << "sup";
}

NAN_METHOD(hello) {

  int count = 0;
  for (int i = 0; i < 100000000; i++) {
    count = i;
  }
  myFunc();
  std::cout << "hello2\n";
}

NAN_MODULE_INIT(init) {
  Nan::SetMethod(target, "hello", hello);
}

NODE_MODULE(hello, init);