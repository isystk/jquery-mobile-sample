all: js_pack js_concat

JS_TARGETS := $(shell ls ./js/lib/plugins/*)
JS_MIN_EXPORT = ./js/lib/jquery-plugins.min.js
js_pack: $(JS_TARGETS)
	rm -Rf $(JS_MIN_EXPORT)
	java -jar ./bin/compiler.jar --compilation_level SIMPLE_OPTIMIZATIONS $(addprefix --js=,$^) > $(JS_MIN_EXPORT)

JS_EXPORT = ./js/lib/jquery-plugins.js
js_concat: $(JS_TARGETS)
	rm -Rf $(JS_EXPORT)
	cat $^ > $(JS_EXPORT)

.PHONY: all js_pack js_concat
