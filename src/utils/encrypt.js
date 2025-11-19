// utils/encrypt.js
import JSEncrypt from 'jsencrypt'

// 公钥，后端生成并提供给前端
const publicKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAs1Ilb6NBM4Kqo5TEOhHuyVAjW3XSWj6TCpzbUTiLOaFpQQCD
1hwJ5joCs76IDaYa21dGcofm0KZkeEdMq5IEJf0gGOzyIO/oS5kvNCpeLQ0iccRL
dR7XC/IC9Rk7XCAKroNRb9Nu56OqI60VjtzgRenhcsBrfDESvz0JdiKBIZcx6zBk
EPiOWn5lhHwdU4jy6xs4hqb4a9qAA3Soln91+iN4kNIkvjIEuRxvgLbQILHJMOMW
x/pAIxDtaNXU0cZfxcLf3kY4l17qK2xBznDNPhPIuxBH/9AIr1QzSAIuaBFdeFER
AKFOeCsmuMbHmnZGti/xLXg8emo/S7jj4/mnrwIDAQABAoIBAGnDo6zqv0QgZ4C/
99TASvSVvaTuIzly+sshpQGMtiExoKDkKt4X/4a45Gsbj6dtNx3zpetbWLnrygpf
E0uGfcfiOhI5fr4KghpEqWC9NHqh6pTrUA4uOGwlO7VQQoCdrW8sqNWqARnCoFEW
f0aZ4/WYco56C2tejk4ZNAFnbH5gb/d8P9ojoPi9J6SM7mYpKSfqmk4YMJIgKEju
6BjxsDCSq1Ej1WkRQKm5I/eJDNnXmwMme5Vq00JCCdA9QXIvuaAXj9Cx0IHA3rq5
vOoR0ReZlK0wMrFeXbLV3CWvigOgr8ecEs4mDebH5IBBgqNlLDsmWmtWwTdBHltI
5RBmI9ECgYEA3mgPgJ/jOXKXSUzqAARcuunQ0F6tZvPboCCVnp9kyCCTIKnYFuH3
3qHXbbmMjixU5HoCUdPDWpYjUgW+EE6lM5Rz35xDC1HYxQyXEGm0c9B3kqnwDIR2
CSkPLkHbzh01SVt62kmtyarh6z0+2sJuq1MwjoVTUOCMl3x3EyMv7dsCgYEAzmgQ
575331kB0wXvbJ4NzEHaFOpaPoxnBd4id09E5iESYJe7t1VQqxWuboHzD2cpFXC7
Zfg2QaQL7QuLeJdqDUPbpQhsJ4n+yKeeQ+zvxlacdgZ/PqMfFl2KvROHuI3deSmK
VuncsjB/c6t+XnxzN7lKIkIXZ/BD9GuPwD2HN70CgYBM1aRtak9EvHrZfvHkWZ1z
kW1rXxoG1D5OvpMR/r0BiodppGOb3CsWxdC3/n85asVVPXVpsX/u3qmLH6K+3Xyj
Kikx2jkrQvZhdO0HZY1K6X01tPHSUTy6A25UK7p1JZAQLMNvgD7Cyf9MlpcNWliD
ZbUDt7nF2h2YBA7bFK/tOwKBgDXT18zH1DUP3jTtEFJQKaMB7WCU+THkpZ1XH7/j
kUE+kK9WAqM+AYqMXe/9vahfq8wmmQhvoZ6erGmGIDozqnmJH8e7GZF6IFKtu81V
BfbAcY8qBJcOLTZE8MB8TmGnxYEqfyRJWr+xfBtrNspnRBjdHmMuvzHg66fbQSLO
KOw1AoGBANooagfN63sElhtGNmI7dqsbBedGklCbUerlYouy0y7svVcSuKHFulLy
eWvBCZOM1QPMwcFHOaYXsbPTzusp7PLUB5vGz65xrZe40HfBLuPZtRv8/Dxv5HxR
//efS3I3IdPIUmcgxNm5U6ee3H29JXvZbP+myiKLDWiivHwkjkrt
-----END RSA PRIVATE KEY-----
`

// 使用 RSA 加密
export function encryptPassword(password) {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  return encrypt.encrypt(password)  // 返回 Base64 编码字符串
}
