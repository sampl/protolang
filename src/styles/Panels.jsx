import styled from 'styled-components/macro'

export const Panel = styled.div`
  padding: 1rem;
  background-image: ${p => p.$grid ? 'url(/images/grid.svg)' : ''};
  background-size: 200px;
  border-radius: ${p => p.$roundedS ? '10px' :
                        p.$roundedM ? '20px' :
                        p.$roundedL ? '30px' :
                                      '0'};
  color: ${p =>  p.$screen ?  'white' :
                              '#333' };
  background-color: ${p =>  p.$dark ?   '#f5f5f5' :
                            p.$screen ? '#333' : 
                                        '#fff' };
  box-shadow: ${p =>  p.$inset ? `inset 2px 2px 0 0 #ddd, inset -2px -2px 0 #eee` :
                      p.$raised  ? `inset -2px -2px 0 #ddd, inset 2px 2px 0 0 #eee, 2px 2px 0 0 hsla(0, 0%, 90%, 0.5)` :
                      ''};
`
