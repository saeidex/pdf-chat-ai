#include <cmath>
#include <iostream>
using namespace std;

int main() {
  // January = 31
  // February = 28
  // March = 31
  // 1 -> 31
  // 2 -> 28

  // 1 -> fabruary
  // 0 -> January
  int month_days[13] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};

  // 1 -> January

  int month; // 1, 2, 3,..., 12
  int weekday;
  //  7 E: 6
  /// 6 E: 5
  /// 1 E: 0
  cin >> month >> weekday;

  // cell = 31 + (weekday -1)

  int days = month_days[month] + weekday - 1;

  int cols = days / 7;

  cout << ceil(cols) << endl;

  int result = days / 7; // 5

  if (cols % 7 > 0) {
    result++;
  }
}