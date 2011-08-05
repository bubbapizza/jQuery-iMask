SRC_DIR   = source

PREFIX    = .
MOD_DIR   = ${PREFIX}/node_modules
DIST_DIR  = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER   = ${MOD_DIR}/uglify-js/bin/uglifyjs --unsafe

BASE_FILES = ${SRC_DIR}/intro.js\
	${SRC_DIR}/jquery.imask.js

IMASK      = ${DIST_DIR}/jquery-imask.js
IMASK_MIN  = ${DIST_DIR}/jquery-imask-min.js

IMASK_VER  = $(shell cat version.txt)
DATE       = $(shell git log -1 --pretty=format:%ad)


all: ${IMASK} ${IMASK_MIN}

core: imask

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

imask: ${CR}

${IMASK}: ${BASE_FILES} | ${DIST_DIR}
	@@echo "Building" ${IMASK}

	@@cat ${BASE_FILES} |                  \
		sed 's/@DATE/'"${DATE}"'/' |       \
		sed 's/@VERSION/'"${IMASK_VER}"'/' \
		> ${IMASK};

${IMASK_MIN}: ${IMASK}
	@@if test ! -z ${JS_ENGINE}; then                                     \
		echo "Minifying" ${IMASK_MIN};                                    \
		${COMPILER} ${IMASK} > ${IMASK_MIN};                              \
	else                                                                  \
		echo "You must have NodeJS installed in order to minify iMask.";  \
	fi

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

.PHONY: all imask