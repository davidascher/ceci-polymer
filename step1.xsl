<?xml version="1.0"?>
<sch:pattern xmlns:sch="http://www.ascc.net/xml/schematron" name="Check that element is a ceci- element.">
  <sch:rule context="">
    <sch:assert test="starts-with(local-name(), 'ceci-')">Element starts with 'ceci-'
    </sch:assert>
  </sch:rule>
</sch:pattern>
