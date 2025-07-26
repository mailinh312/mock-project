import { TestBed } from '@angular/core/testing';
import { Ability } from '@casl/ability';
import { AbilityService } from './ability.service';
import { Auth } from '../service/auth';

describe('AbilityService', () => {
  let service: AbilityService;
  let mockAuth: jasmine.SpyObj<Auth>;
  let mockAbility: jasmine.SpyObj<Ability>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('Auth', ['getCurrentUserWithPermissions']);
    const abilitySpy = jasmine.createSpyObj('Ability', ['update', 'can', 'cannot']);

    TestBed.configureTestingModule({
      providers: [
        AbilityService,
        { provide: Auth, useValue: authSpy },
        { provide: Ability, useValue: abilitySpy }
      ]
    });
    
    service = TestBed.inject(AbilityService);
    mockAuth = TestBed.inject(Auth) as jasmine.SpyObj<Auth>;
    mockAbility = TestBed.inject(Ability) as jasmine.SpyObj<Ability>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update ability for admin user', async () => {
    const adminUser = {
      id: 1,
      username: 'admin',
      role: 'admin',
      permissions: []
    };

    mockAuth.getCurrentUserWithPermissions.and.returnValue(Promise.resolve(adminUser));

    await service.updateAbility();

    expect(mockAbility.update).toHaveBeenCalledWith([
      { action: 'manage', subject: 'all' }
    ]);
  });

  it('should update ability for regular user with permissions', async () => {
    const regularUser = {
      id: 2,
      username: 'user',
      role: 'user',
      permissions: ['read:user', 'update:profile']
    };

    mockAuth.getCurrentUserWithPermissions.and.returnValue(Promise.resolve(regularUser));

    await service.updateAbility();

    expect(mockAbility.update).toHaveBeenCalledWith([
      { action: 'read', subject: 'profile' },
      { action: 'read', subject: 'user' },
      { action: 'update', subject: 'profile' }
    ]);
  });

  it('should clear ability when no user', async () => {
    mockAuth.getCurrentUserWithPermissions.and.returnValue(Promise.resolve(null));

    await service.updateAbility();

    expect(mockAbility.update).toHaveBeenCalledWith([]);
  });

  it('should handle permissions without colon format', async () => {
    const userWithSimplePermissions = {
      id: 3,
      username: 'user',
      role: 'user',
      permissions: ['read', 'write']
    };

    mockAuth.getCurrentUserWithPermissions.and.returnValue(Promise.resolve(userWithSimplePermissions));

    await service.updateAbility();

    expect(mockAbility.update).toHaveBeenCalledWith([
      { action: 'read', subject: 'profile' },
      { action: 'read', subject: 'all' },
      { action: 'write', subject: 'all' }
    ]);
  });
});

