#!/bin/bash

echo XSD validation
xmllint --relaxng $1 $2

echo Step1 ...
xsltproc iso_dsdl_include.xsl ceci-element.sch > step1.xsl

echo Step2 ...
xsltproc iso_abstract_expand.xsl step1.xsl > step2.xsl

echo Step3 ...
xsltproc iso_svrl_for_xslt1.xsl step2.xsl > step3.xsl

echo Validation ...
xsltproc step3.xsl $2 | tee result.svrl