---
title: C语言题集
date: 2026-04-01
lastmod: 
description: 本帖用于收集难倒我的 C语言 题目
categories:
    - Documents
---
<!--more-->

## 01：旋转矩阵

<details>
<summary>展开</summary>

### 题目描述
- 编写函数，将一个矩阵原地逆时针旋转90度。
- 原地旋转指不能使用另外一个一维或二维数组做中间存储，但可以使用变量。
- 编写主函数，先输入矩阵的行数和列数，然后调用函数按行输入矩阵的元素（设均为整数），再调用函数旋转，调用函数显示。
- 矩阵的行数、列数均不超过10。
### 样例
- 输入：
```
4 4
1 2 3 4
5 6 7 8
9 10 11 12
13 14 15 16
```
- 输出：
```
4 8 12 16
3 7 11 15
2 6 10 14
1 5 9 13
```

<details>
<summary>提示</summary>

> [!TIP]
> 逆时针旋转90度，相当于将矩阵转置后，再把每一列的元素反转。
</details>

<details>
<summary>题解</summary>

### 题解

```C
#include <stdio.h>
 
// 输入
void input(int t[][10], int m, int n) {
  for (int i = 0; i < m; i++) {
    for (int j = 0; j < n; j++) {
      scanf("%d", &t[i][j]);
    }
  }
}

//逆时针旋转90度，相当于将矩阵转置后，再把每一列的元素反转。

// 转置
void work1(int t[][10], int m, int n) {
  for (int i = 0; i < 10; i++) {
    for (int j = i + 1; j < 10; j++) {
      int temp = t[i][j];
      t[i][j] = t[j][i];
      t[j][i] = temp;
    }
  }
}
 
// 上下翻转
void work2(int t[][10], int m, int n) {
  for (int i = 0; i < m / 2; i++) {
    for (int j = 0; j < n; j++) {
      int temp = t[i][j];
      t[i][j] = t[m - 1 - i][j];
      t[m - 1 - i][j] = temp;
    }
  }
}
 
// 输出
void output(int t[][10], int m, int n) {
  for (int i = 0; i < m; i++) {
    for (int j = 0; j < n - 1; j++) {
      printf("%d ", t[i][j]);
    }
    printf("%d", t[i][n - 1]);
    printf("\n");
  }
}
 
int main() {
  int m, n;//m行n列
  scanf("%d %d", &m, &n);
  int t[10][10];
  input(t, m, n);
  work1(t, m, n);
  work2(t, n, m);
  output(t, n, m);
  return 0;
}
```

>[!CAUTION]
>转置部分不能写成：
>
>```C
>void work1(int t[][10], int m, int n) {
>  // 与上述代码的区别在于 i,j 的范围
>  for (int i = 0; i < m; i++) {
>    for (int j = i + 1; j < n; j++) {
>      int temp = t[i][j];
>      t[i][j] = t[j][i];
>      t[j][i] = temp;
>    }
>  }
>}
>```
> - 当 m > n 时，某些元素（如 `t[n][0]`）不会被访问。

</details>

</details>