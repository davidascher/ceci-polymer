<sch:pattern name="Check that element is a ceci- element." xmlns:sch="http://www.ascc.net/xml/schematron">
  <sch:rule context="">
    <sch:assert test="starts-with(local-name(), 'ceci-')">
      Element starts with 'ceci-'
    </sch:assert>
  </sch:rule>
</sch:pattern>