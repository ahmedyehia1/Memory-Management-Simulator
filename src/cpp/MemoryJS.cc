#include "MemoryJS.h"

MemoryJS::MemoryJS(const Napi::CallbackInfo& info) : ObjectWrap(info){
    Napi::Env env = info.Env();
    Napi::Object HolesObj = info[1].ToObject();
    int HL = HolesObj.As<Napi::Array>().Length();
    std::vector<std::vector<long long>> Holes(HL);
    std::vector<long long> Hole(2);
    Napi::Object Arr;
    long long tot = info[0].As<Napi::Number>().Int64Value();
    for(int i = 0; i < HL; i++){
        Arr = HolesObj.Get(i).ToObject();
        Hole[0] = Arr.Get("0").ToNumber().Int64Value();
        Hole[1] = Arr.Get("1").ToNumber().Int64Value();
        Holes[i] = Hole;
    }
    memory tmp(tot,Holes);
    this->core = tmp;
}

Napi::Value MemoryJS::create_layout(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    std::vector<segment> layout = this->core.create_layout();
    Napi::Object Arrext = Napi::Object::New(env);
    for(int i = 0,ll = layout.size(); i < ll; i++){
        Napi::Object Arrint = Napi::Object::New(env);
        Arrint.Set("name",Napi::String::New(env,layout[i].name));
        Arrint.Set("process_no",Napi::Number::New(env,layout[i].process_no));
        Arrint.Set("base",Napi::Number::New(env,layout[i].base));
        Arrint.Set("size",Napi::Number::New(env,layout[i].size));
        Arrint.Set("status",Napi::Boolean::New(env,layout[i].status));
        Arrext.Set(i,Arrint);
    }
    return Arrext;
}

Napi::Value MemoryJS::remove(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    std::string segment_name = info[0].ToString().Utf8Value();
    int process_index = info[1].ToNumber().Int32Value();
    std::vector<segment> pro_arg = this->core.remove(segment_name,process_index);
    Napi::Object Seg, Process = Napi::Object::New(env);
    int PL = pro_arg.size();
    for(int i = 0; i < PL; i++){
        Seg = Napi::Object::New(env);
        Seg.Set("name",Napi::String::New(env,pro_arg[i].name));
        Seg.Set("process_no",Napi::Number::New(env,pro_arg[i].process_no));
        Seg.Set("base",Napi::Number::New(env,pro_arg[i].base));
        Seg.Set("size",Napi::Number::New(env,pro_arg[i].size));
        Seg.Set("status",Napi::Boolean::New(env,pro_arg[i].status));
        Process.Set(i,Seg);
    }
    return Process;
}

Napi::Value MemoryJS::First_fit(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    Napi::Object Process = info[0].ToObject();
    int PL = Process.As<Napi::Array>().Length();
    std::vector<segment> pro_arg(PL);
    Napi::Object Seg;
    for(int i = 0; i < PL; i++){
        Seg = Process.Get(i).ToObject();
        segment seg(Seg.Get("name").ToString().Utf8Value(),
        Seg.Get("size").ToNumber().Int64Value(),Seg.Get("process_no").ToNumber().Int32Value());
        pro_arg[i] = seg;
    }
    pro_arg = this->core.First_fit(pro_arg);
    Process = Napi::Object::New(env);
    PL = pro_arg.size();
    for(int i = 0; i < PL; i++){
        Seg = Napi::Object::New(env);
        Seg.Set("name",Napi::String::New(env,pro_arg[i].name));
        Seg.Set("process_no",Napi::Number::New(env,pro_arg[i].process_no));
        Seg.Set("base",Napi::Number::New(env,pro_arg[i].base));
        Seg.Set("size",Napi::Number::New(env,pro_arg[i].size));
        Seg.Set("status",Napi::Boolean::New(env,pro_arg[i].status));
        Process.Set(i,Seg);
    }
    return Process;
}

Napi::Value MemoryJS::Best_fit(const Napi::CallbackInfo& info){
    Napi::Env env = info.Env();
    Napi::Object Process = info[0].ToObject();
    int PL = Process.As<Napi::Array>().Length();
    std::vector<segment> pro_arg(PL);
    Napi::Object Seg;
    for(int i = 0; i < PL; i++){
        Seg = Process.Get(i).ToObject();
        segment seg(Seg.Get("name").ToString().Utf8Value(),
        Seg.Get("size").ToNumber().Int64Value(),Seg.Get("process_no").ToNumber().Int32Value());
        pro_arg[i] = seg;
    }
    pro_arg = this->core.Best_fit(pro_arg);
    Process = Napi::Object::New(env);
    PL = pro_arg.size();
    for(int i = 0; i < PL; i++){
        Seg = Napi::Object::New(env);
        Seg.Set("name",Napi::String::New(env,pro_arg[i].name));
        Seg.Set("process_no",Napi::Number::New(env,pro_arg[i].process_no));
        Seg.Set("base",Napi::Number::New(env,pro_arg[i].base));
        Seg.Set("size",Napi::Number::New(env,pro_arg[i].size));
        Seg.Set("status",Napi::Boolean::New(env,pro_arg[i].status));
        Process.Set(i,Seg);
    }
    return Process;
}

Napi::FunctionReference MemoryJS::constructor;
Napi::Function MemoryJS::GetClass(Napi::Env env){
    Napi::Function func = DefineClass(env,"MemoryJS",{
        MemoryJS::InstanceMethod("create_layout",&MemoryJS::create_layout),
        MemoryJS::InstanceMethod("remove",&MemoryJS::remove),
        MemoryJS::InstanceMethod("First_fit",&MemoryJS::Best_fit),
        MemoryJS::InstanceMethod("Best_fit",&MemoryJS::Best_fit),
    });
    constructor = Napi::Persistent(func);
    constructor.SuppressDestruct();
    return func;
}

Napi::Object Init(Napi::Env env,Napi::Object exports){
    Napi::String name = Napi::String::New(env, "MemoryJS");
    exports.Set(name, MemoryJS::GetClass(env));
    return exports;
}

NODE_API_MODULE(addon, Init);