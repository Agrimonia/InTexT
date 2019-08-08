import json

def main():
  char_file = open('char.dic', 'r', encoding='utf-8')
  idx = 0
  char_dic = {}
  for char in char_file.readlines():
    char_dic[char[0]] = idx
    idx += 1
  char_file.close()
  print(char_dic)
  with open('./char_dic.json', 'w') as f:
    json.dump(char_dic, f)


if __name__ == '__main__':
  main()

