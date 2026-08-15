PORT ?= 8989

.PHONY: serve
serve:
	python3 -m http.server $(PORT) --bind 127.0.0.1
