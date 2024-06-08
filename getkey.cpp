#include <stdio.h>
#include <string.h>
#include <stdlib.h>

int    count(char* buf)
{
  char*  p = buf;
  int    n = 0;
  while(p && *p){
    if(strchr(",.\"[]", *p))
      ;
    else
      n++;
    p++;
  }
  return  n;
}

char*  replace(char* buf, char from, char to)
{
  char*  p = buf;
  while(p && *p){
    if(*p == from)
      *p = to;
    p++;
  }
  return  buf;
}

char*  getkey(char* top, const char* word, char* buf)
{
  char   tmp[256];
  char*  p = top;
  char*  q;
  if((q = strstr(p, word))){
    char*  r = strstr(q + 1, "[");
    if(! r){
      printf("r is null! at getkey() ....  word=[%s]\n", word);
    }
    char*  s = r ? strstr(r + 1, "]") : NULL;
    if(r && s){
      // sprintf(buf, "%02d  %.*s", (int)(s - r - 3), (int)(s - q + 1), q);
      sprintf(tmp, "%.*s", (int)(s - r - 1), r + 1);
      replace(tmp, ',', '.');
      sprintf(buf, "%2d\t%s", count(tmp), tmp);
    }
    p = q + 1;
  }
  else
    return  NULL;
  return  p;
}


//
char*  getkey2(char* top, const char* word, char* buf)
{
  char*  p = top; //topの先頭アドレスを指すポインタ
  char*  q; //strstrの返り値を格納するポインタ
  if((q = strstr(p, word))){  //wordが見つかったら
    char*  r = strstr(q + 1, ":");  
    if(! r){
      printf("r is null! at getkey() ....  word=[%s]\n", word);
    }
    char*  s = r ? strstr(r + 1, ",") : NULL; //
    if(r && s){
      // sprintf(buf, "%02d  %.*s", (int)(s - r - 1), (int)(s - q), q);
      sprintf(buf, "%.*s", (int)(s - r - 1), r + 1);
    }
  }
  else
    return  NULL;
  return  p;
}


int  main()
{
  char  buf[640000];
  char* p = buf;  //bufの先頭アドレスを指すポインタ
  char* q;  

  fgets(buf, sizeof(buf), stdin); //最大64000文字をbufに読み込む

  int  n = 0;
  while(p && *p){ //入力された文字列の最後まで繰り返す
    char  tmp[1024] = {0};
    //-------------------------------------
    if(! *p)
      break;
    if(! (q = getkey2(p, "\"timestamp\"", tmp)))
      break;
    strcat(tmp, "\t");
    p = q + 1;

    //-------------------------------------
    if(! *p){
      printf("%s\n", tmp);
      break;
    }
    if(! (q = getkey(p, "\"text\"", tmp + strlen(tmp))))
      break;
    strcat(tmp, "\t");
    p = q + 1;

    //-------------------------------------
    if(! *p){
      printf("%s\n", tmp);
      break;
    }
    if(! (q = getkey(p, "\"removed\"", tmp + strlen(tmp))))
      break;
    strcat(tmp, "\n");
    p = q + 1;

    printf(//"%03d:\t"
	   "%s"
	   //, ++n
	   , tmp
	   );
  }
  return  0;
}
