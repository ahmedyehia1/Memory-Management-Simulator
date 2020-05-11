#ifndef SEG
#define SEG
#include <iostream>
#include <string>

class segment
{
    public:
    std::string name;
    int process_no;
    long long base;
    long long size;
    bool status;//0(false)--->pending
    //1(true) --->allocated
    segment(std::string name_new,long long size_new,int process_no);
    segment();
};


#endif
