#include "memory.h"
#include <vector>
#include <algorithm>
#include <iostream>
#include "segment.h"
using namespace std;
bool compare_holes(vector <long long> a,vector <long long>b)
{	if(a[0] < b[0])
	{
		return a[0] < b[0];
	}
	else if (a[0]==b[0])
	{
		return a[1]<b[1];
	}
    //return a[0] < b[0];
}
bool compare_holes2(vector <long long> a,vector <long long>b)
{
		return a[1] < b[1];
    //return a[0] < b[0];
}
memory::memory(long long total_size,vector<vector<long long>> initial_Holes)
{
    m_total_size = total_size;
    Holes=initial_Holes;

    organize_holes();
    // for(long long i =0;i<Holes.size();i++)
    // {
    // 	cout<<Holes[i][0]<<" "<<Holes[i][1]<<endl;
    // }

    vector<segment> tmp;
    segment temp2;
    temp2.name="Reserved";

    if(Holes[0][0] !=0)
    {
    	temp2.base=0;
    	temp2.size = Holes[0][0];
    	tmp.push_back(temp2);
    }
    for(int i = 1, n = Holes.size(); i < n; i++)
    {
    	temp2.base = Holes[i-1][0] + Holes[i-1][1];
    	temp2.size = Holes[i][0] -(Holes[i-1][0] + Holes[i-1][1]-1);
    	tmp.push_back(temp2);
    }
    if(Holes[Holes.size()-1][0]+Holes[Holes.size()-1][1] < total_size)
    {
    	temp2.base=Holes[Holes.size()-1][0] + Holes[Holes.size()-1][1];
    	// cout<<temp2.base<<endl;
    	temp2.size = total_size- temp2.base;
    	// cout<<temp2.size<<endl;
    	tmp.push_back(temp2);
    }
    Process.push_back(tmp);
    for(int i =0; i < Process[0].size();i++)
    {
    	Process[0][i].process_no= i;
    }
    // for(int i = 0; i < Process[0].size();i++)
    // {
    // 	cout<<Process[0][i].name<<" "<<Process[0][i].base<<" "<<Process[0][i].size<<endl;
    // }
}

//std::vector<segment> memory::add(segment);
/*vector<segment> memory::First_fit(vector<segment> Pnew)
{

}*/

vector<segment> memory::Best_fit(vector<segment> Pnew)
{
	//long long min_fit_size;
	vector<segment> layout;

	vector<vector<long long>> temp=Holes;
	sort(temp.begin(),temp.end(),compare_holes2);
	bool flag =0;
	for(int i = 0, n = Pnew.size(); i < n; i++)
	{

		for(int j = 0, m = temp.size(); j < m; j++)
		{
			if(temp[j][1] >= Pnew[i].size )
			{
				Pnew[i].base=temp[j][0];
				temp[j][1]-= Pnew[i].size;
				temp[j][0]+= Pnew[i].size;
				if(temp[j][1] == 0)
				{
					temp.erase(temp.begin()+j);
				}
				break;
			}
			if(j== m-1 && temp[j][1] < Pnew[i].size)
			{
				flag =1;
			}
		}
		if(flag == 1)
		{
			break;
		}
	}

	if(flag == 0)
	{
		sort(temp.begin(),temp.end(),compare_holes);
		Holes=temp;
		if(Pnew[0].process_no <= (Process.size()-1))
		{
			for(int i = 0, n = Process[Pnew[0].process_no].size(); i < n; i++)
			{
				Process[Pnew[0].process_no][i].status =1;
				Process[Pnew[0].process_no][i].base=Pnew[i].base;
			}
		}
		else
		{
			for(int i = 0, n = Pnew.size(); i < n; i++)
			{
				Pnew[i].status=1;
			}
			Process.push_back(Pnew);
		}


	}
	else
	{
		if(Pnew[0].process_no <= (Process.size()-1))
		{
			for(int i = 0, n = Process[Pnew[0].process_no].size(); i < n; i++)
			{
				Process[Pnew[0].process_no][i].status =0;
				Process[Pnew[0].process_no][i].base=-1;
			}
		}
		else
		{
			for(int i = 0, n = Pnew.size(); i < n; i++)
			{
				Pnew[i].status=0;
				Pnew[i].base= -1;
			}
			Process.push_back(Pnew);
		}
	}
	return create_layout();
}

//std::vector<segment> memory::remove(long long base,long long size);
//std::vector<segment> memory::remove(segment);
//std::vector<std::segment> memory::remove(long long process_no,long long segment_no);
void memory::organize_holes()
{
    segment tmp;
    tmp.name = "reserved";
    sort(Holes.begin(),Holes.end(),compare_holes);
    for(long long i =0;i<Holes.size();i++)
    {
            //cout<<Holes[i][0]<<" "<<Holes[i][1]<<endl;
    }
    //cout<<endl;
    vector<vector<long long>> temp;
    long long start;
    long long size;
    bool flag=0;
    for(int i =0,n=Holes.size() ;i<n;i++)
    {
        start =Holes[i][0];
        size =Holes[i][1];
        for(int j = i+1;j<n;j++)
        {
            if(Holes[j][0] >= start   && Holes[j][0] <= start+size-1)
            {
                size = max(Holes[j][1]+Holes[j][0],start+size)-start;
                if(j == n-1)
                {
                    temp.push_back({start,size});
                    i=j-1;
                }
            }
            else
            {
                temp.push_back({start,size});
                i=j-1;
                //flag =1;
                break;
            }
 
        }
        if(i==n-1&& ((Holes[n-2][1]+Holes[n-2][0] )>= start))
        {
 
        }
        else if(i==n-1)
        {
            temp.push_back({start,size});
        }
        /*if(flag ==0)
        {
            temp.push_back({start,size});
            break;
        }
        flag=0;*/
    }
    /*if(flag==1)
    {
        temp.push_back({start,size});
    }*/
    Holes = temp;
}
vector<vector<segment>> memory::get_Process()
{
	return Process;
}
vector<segment> memory:: create_layout()
{
    vector<segment>holes_seg(Holes.size());
    for(int i=0;i<Holes.size();i++)
    {   holes_seg[i].name="Hole";
        holes_seg[i].base=Holes[i][0];
        holes_seg[i].size=Holes[i][1];
    }
//    vector<segment>mem_layout(Holes.size()+Process.size());
//    for(int i=0;i<holes_seg.size();i++)
//    {
//        mem_layout.push_back(holes_seg[i]);
//    }
    for(int i=0;i<Process.size();i++)
    {
        for(int k=0;k<Process[i].size();k++)
        {
            if (Process[i][k].status)
            {
                holes_seg.push_back(Process[i][k]);
            }
        }
    }
 
  return holes_seg;
}
vector<segment> memory:: First_fit(vector<segment>new_seg){
    int flag;
    vector<vector<long long>>temp_holes=Holes;
for (int i=0;i<new_seg.size();i++)
    { flag=0;
      for(int j=0;j<temp_holes.size();j++)
      {
          if(new_seg[i].size<temp_holes[j][1]) // new size & new address in temp_holes
          {
              new_seg[i].base=temp_holes[j][0];
              temp_holes[j][0]=temp_holes[j][0]+new_seg[i].size-1;
              temp_holes[j][1]=temp_holes[j][1]-new_seg[i].size;
              flag=1;
              break;
          }
          else if (new_seg[i].size==temp_holes[j][1]) // same old address size=0
          {
              new_seg[i].base=temp_holes[j][0];
              temp_holes.erase(temp_holes.begin()+j);
              flag=1;
              break;

          }
      }
        if (flag==0)
        { for (int k=0;k<new_seg.size();k++)
            {
              new_seg[k].status= false;
            }
            if(new_seg[0].process_no>=Process.size())
            {
                Process.push_back(new_seg);
                break;
            }
            else
            {
                break;
            }
        }
    }
    if(flag==1)
    {
        for (int k=0;k<new_seg.size();k++)
        {
            new_seg[k].status= true;
        }
        if(new_seg[0].process_no>=Process.size())
        {
            Process.push_back(new_seg);
        }
        Holes=temp_holes;
    }
    return create_layout();
}
vector<segment> memory::remove(string segment_name,int process_index)
{
    if(segment_name=="Reserved")
    {
    	vector<long long> temp;
    	temp.push_back(Process[0][process_index].base);
    	temp.push_back(Process[0][process_index].size);
    	Holes.push_back(temp);
        Process[0].erase(Process[0].begin()+process_index);
        for(int i=0;i<Process[0].size();i++)
        {
            Process[0][i].process_no=i;
        }
        organize_holes();
        return create_layout();
    }
    else
    {
    	vector<long long> temp;
        Process.erase(Process.begin()+process_index);
        for(int i=0;i<Process[process_index].size();i++)
        {
        	temp[0] = Process[process_index][i].base;
        	temp[1] = Process[process_index][i].size;
        	Holes.push_back(temp);
            Process[process_index][i].status= false;
        }
        organize_holes();
        return create_layout();
    }
}

//yehia
memory::memory(){
	m_total_size=100;
}
