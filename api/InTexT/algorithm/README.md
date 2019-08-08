# Algo_IntexT

InTexT 抒写应用的算法部分

## env requirements

`pip torch-0.4.1-cp37-cp37m-win_amd64.whl`（在本文件夹下）

``pip install allennlp`

PS: allennlp 要求的 pytorch 版本为 0.4，此版本只有官方源，在国内下载速度较慢，故本文件夹包含了 torch0.4 的安装文件。

## Manual

功能通过 model.py 中的 Simple 类的 search 函数进行操作，test.py 中提供了示例。

## 语料库准备

1. 将中文语料段中的`。`和`，`替换为`\n`
2. 然后替换本文件夹下的`corpus.txt`文件中的内容。
3. 在本文件夹下运行`python gen_corpus_feature.py`

## TODO

整理文件位置，方便后续迭代。
