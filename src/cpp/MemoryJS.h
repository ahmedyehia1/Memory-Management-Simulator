#pragma once
#include <napi.h>
#include "memory.h"

class MemoryJS : public Napi::ObjectWrap <MemoryJS>
{
private:
    memory core;
    static Napi::FunctionReference constructor;
public:
    MemoryJS(const Napi::CallbackInfo&);
    Napi::Value create_layout(const Napi::CallbackInfo&);
    Napi::Value First_fit(const Napi::CallbackInfo&);
    Napi::Value Best_fit(const Napi::CallbackInfo&);
    Napi::Value remove(const Napi::CallbackInfo&);
    static Napi::Function GetClass(Napi::Env);
};