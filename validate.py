from lxml import etree
from lxml import isoschematron

# relaxng_doc = etree.parse('ceci-app.rng')
# relaxng = etree.RelaxNG(relaxng_doc)
# schematron = isoschematron.Schematron(relaxng_doc)

# input_doc = etree.parse('ceci-app-test.html')
# print relaxng.assertValid(input_doc)


schematron = isoschematron.Schematron(etree.XML('''
<schema xmlns="http://purl.oclc.org/dsdl/schematron" >
  <phase id="phase.sum_check">
    <active pattern="sum_equals_100_percent"/>
  </phase>
  <phase id="phase.entries_check">
    <active pattern="all_positive"/>
  </phase>
  <pattern id="sum_equals_100_percent">
    <title>Sum equals 100%.</title>
    <rule context="Total">
      <assert test="sum(//Percent)=100">Sum is not 100%.</assert>
    </rule>
  </pattern>
  <pattern id="all_positive">
    <title>All entries must be positive.</title>
    <rule context="Percent">
      <assert test="number(.)>0">Number (<value-of select="."/>) not positive</assert>
    </rule>
  </pattern>
</schema>
'''))

xml = etree.XML('''
<Total>
  <Percent>0</Percent>
  <Percent>50</Percent>
  <Percent>50</Percent>
</Total>
''')

print schematron.assertValid(xml)