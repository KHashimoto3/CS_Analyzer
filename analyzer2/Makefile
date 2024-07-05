# divided-record-files ディレクトリ内のすべての JSON ファイルを取得
JS_FILES := $(wildcard divided-record-files/*.json)

# デフォルトのターゲットを定義
# これにより、`make` コマンドを実行したときに divided-record-files ディレクトリ内の
# すべての JSON ファイルに対してターゲットが実行されます
all: process_files

# 各 JSON ファイルに対するターゲットを定義
# $@ はターゲット名（ここでは各 JSON ファイルのパス）を表します
process_files:
	@success_count=0; \
	error_count=0; \
	for file in $(JS_FILES); do \
		echo "Processing $$file"; \
		if node get-key.js $$file; then \
			success_count=$$((success_count + 1)); \
		else \
			echo "Error processing $$file"; \
			error_count=$$((error_count + 1)); \
		fi; \
	done; \
	echo "Processed files: $$success_count"; \
	echo "Error files: $$error_count"

# `make all` をデフォルトターゲットとして定義するための設定
.PHONY: all process_files
