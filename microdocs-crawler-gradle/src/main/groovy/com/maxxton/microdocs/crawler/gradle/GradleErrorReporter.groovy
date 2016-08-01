package com.maxxton.microdocs.crawler.gradle

import com.maxxton.microdocs.crawler.ErrorReporter
import org.gradle.api.logging.Logger

/**
 * @author Steven Hermans
 */
class GradleErrorReporter extends ErrorReporter{

    private final Logger logger;

    GradleErrorReporter(Logger logger) {
        this.logger = logger
    }

    @Override
    void printError(String msg) {
        logger.error(msg);
    }

    @Override
    void printError(String msg, Throwable e) {
        logger.error(msg, e);
    }

    @Override
    void printNotice(String msg) {
        logger.info(msg);
    }

    @Override
    void printWarning(String msg) {
        logger.warn(msg);
    }
}
