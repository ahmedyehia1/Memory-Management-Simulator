#ifndef MEM
#define MEM
#include "segment.h"
#include <vector>
class memory
{
    public:
    long long m_total_size;
    std::vector<std::vector<long long>> Holes;
    std::vector<std::vector<segment>> Process;
    //std::vector<segment> add(segment);
    std::vector<segment> First_fit(std::vector<segment>);
    std::vector<segment> Best_fit(std::vector<segment>);
    //std::vector<segment> remove(long long base,long long size);
    //std::vector<segment> remove(segment);
    std::vector<segment> create_layout();
    //std::vector<segment> remove(long long process_no,long long segment_no);
    memory();//done
    memory(long long total_size,std::vector<std::vector<long long>> initial_Holes);//done
    void organize_holes();//done
    std::vector<std::vector<segment>> get_Process();
    bool get_status(int process_no);
    std::vector<segment> remove(std::string segment_name,int process_index);
};


#endif
