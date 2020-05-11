

#include "segment.h"

using namespace std;

segment::segment(std::string name_new,long long size_new,int process_no_new)
{

	size = size_new;
	process_no = process_no_new;
	name = name_new;

}
segment::segment() // @suppress("Member declaration not found")
{
	size=0;
	process_no=0;

}

