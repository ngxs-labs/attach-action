import { NgxsSkeletonModule } from '..';

describe(NgxsSkeletonModule.name, () => {
  it('should successfully create module', () => {
    expect(new NgxsSkeletonModule() instanceof NgxsSkeletonModule).toBeTruthy();
  });
});
